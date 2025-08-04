import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AssessmentDownload } from '@database/entities/assessment-download.entity';
import { Assessment } from '@database/entities/assessment.entity';
import { AssessmentDomain } from '@database/entities/assessment-domain.entity';
import { AssessmentGroup } from '@database/entities/assessment-group.entity';
import { AssessmentDomainService } from './assessment-domain.service';
import { MemberRole, DownloadStatus } from '@shared/enums';
import { Workbook } from 'exceljs';
import { AssessmentAbilityDto } from '../guards/assessment-ability.dto';
import { CompressionUtil } from '@shared/utils/compression.util';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class AssessmentDownloadService {
  private readonly logger = new Logger(AssessmentDownloadService.name);

  constructor(
    @InjectRepository(AssessmentDownload)
    private downloadRepository: Repository<AssessmentDownload>,
    @InjectQueue('assessment-downloads') private downloadQueue: Queue,
    private assessmentDomainService: AssessmentDomainService,
    @InjectRedis() private redis: Redis,
  ) {}

  async requestDownload(
    assessmentId: string,
    domainId: string | null,
    user: AssessmentAbilityDto,
  ): Promise<AssessmentDownload> {
    const { isAdmin, assessmentRole, assessmentGroupId, id: userId } = user;

    if (!isAdmin && !assessmentRole) {
      throw new ForbiddenException(
        'You are not authorized to request downloads for this assessment.',
      );
    }

    return await this.downloadRepository.manager.transaction(
      async (manager) => {
        const assessment = await manager.findOne(Assessment, {
          where: { id: assessmentId },
        });
        if (!assessment) {
          throw new NotFoundException(`Assessment ${assessmentId} not found`);
        }

        if (domainId) {
          const domain = await manager.findOne(AssessmentDomain, {
            where: { id: domainId, assessmentId },
          });
          if (!domain) {
            throw new NotFoundException(
              `Domain ${domainId} not found for assessment ${assessmentId}`,
            );
          }

          if (!isAdmin && assessmentRole !== MemberRole.PRIMARY) {
            const group = await manager.findOne(AssessmentGroup, {
              where: { id: assessmentGroupId, assessmentId },
              relations: ['domains'],
            });
            if (!group || !group.domains.some((d) => d.id === domainId)) {
              throw new ForbiddenException(
                'You do not have access to this domain',
              );
            }
          }
        }

        const download = manager.create(AssessmentDownload, {
          assessmentId,
          domainId,
          userId,
          status: DownloadStatus.PENDING,
        });

        await manager.save(AssessmentDownload, download);

        const job = await this.downloadQueue.add('generate-excel', {
          downloadId: download.id,
          assessmentId,
          domainId,
        });

        await manager.update(
          AssessmentDownload,
          { id: download.id },
          { jobId: job.id.toString() },
        );

        return download;
      },
    );
  }

  async generateExcel(
    downloadId: string,
    manager: EntityManager,
  ): Promise<void> {
    const download = await manager.findOne(AssessmentDownload, {
      where: { id: downloadId },
    });
    if (!download) {
      throw new NotFoundException(`Download ${downloadId} not found`);
    }

    try {
      await manager.update(
        AssessmentDownload,
        { id: download.id },
        { status: DownloadStatus.PROCESSING },
      );

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(
        download.domainId ? 'Domain Answers' : 'Assessment Answers',
      );

      // Define styles to match the image exactly
      const headerStyle = {
        fill: {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FF2E7D32' }, // Dark green
        },
        font: {
          bold: true,
          color: { argb: 'FFFFFFFF' }, // White text
          size: 12,
        },
        alignment: {
          horizontal: 'center' as const,
          vertical: 'middle' as const,
        },
        border: {
          top: { style: 'thin' as const },
          bottom: { style: 'thin' as const },
          left: { style: 'thin' as const },
          right: { style: 'thin' as const },
        },
      };

      const domainRowStyle = {
        fill: {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FF4CAF50' }, // Medium green
        },
        font: {
          bold: true,
          color: { argb: 'FF000000' }, // Black text
          size: 12,
        },
        border: {
          top: { style: 'thin' as const },
          bottom: { style: 'thin' as const },
          left: { style: 'thin' as const },
          right: { style: 'thin' as const },
        },
      };

      const componentRowStyle = {
        fill: {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FF81C784' }, // Lighter green
        },
        font: {
          bold: true,
          color: { argb: 'FF000000' }, // Black text
          size: 12,
        },
        border: {
          top: { style: 'thin' as const },
          bottom: { style: 'thin' as const },
          left: { style: 'thin' as const },
          right: { style: 'thin' as const },
        },
      };

      const subComponentRowStyle = {
        fill: {
          type: 'pattern' as const,
          pattern: 'solid' as const,
          fgColor: { argb: 'FFFFFFFF' }, // White
        },
        font: {
          color: { argb: 'FF000000' }, // Black text (not bold)
          size: 11,
        },
        border: {
          top: { style: 'thin' as const },
          bottom: { style: 'thin' as const },
          left: { style: 'thin' as const },
          right: { style: 'thin' as const },
        },
      };

      // Set column widths to match the image
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 12 },
        { header: 'HIE Subcomponent', key: 'subcomponent', width: 35 },
        { header: 'Definition/Meaning', key: 'definition', width: 45 },
        { header: 'Current Status', key: 'status', width: 12 },
        { header: 'Evidence', key: 'evidence', width: 40 },
        { header: 'Reference(s) / Citation', key: 'reference', width: 40 },
      ];

      let rowIndex = 1;

      // Add header row
      const headerRow = worksheet.getRow(rowIndex);
      headerRow.values = ['Code', 'HIE Subcomponent', 'Definition/Meaning', 'Current Status', 'Evidence', 'Reference(s) / Citation'];
      headerRow.height = 40; // Increase header height significantly
      headerRow.eachCell((cell) => {
        cell.style = headerStyle;
      });
      rowIndex++;

      // Add status legend as a comment to the Current Status header
      const statusHeaderCell = worksheet.getCell('D1');
      statusHeaderCell.note = '1 = Initial\n2 = Developing\n3 = Defined\n4 = Managed\n5 = Optimized';

      let hasData = false;

      if (download.domainId) {
        const domainWithAnswers =
          await this.assessmentDomainService.getDomainWithAnswers(
            download.assessmentId,
            download.domainId,
            'en',
          );

        this.logger.log(`Processing single domain: ${domainWithAnswers.name} with ${domainWithAnswers.components.length} components`);
        this.logger.log(`Domain data:`, JSON.stringify(domainWithAnswers, null, 2));
        this.logger.log(`Domain name: "${domainWithAnswers.name}", Domain code: "${domainWithAnswers.code}"`);

        // Add domain row - ALWAYS show domain
        const domainName = domainWithAnswers.name || domainWithAnswers.description || 'Domain Name';
        const domainRow = worksheet.addRow({
          code: domainWithAnswers.code || '1',
          subcomponent: domainName,
          definition: '', // Empty for domain rows
          status: '',
          evidence: '',
          reference: '',
        });
        
        // Apply styling to domain row
        domainRow.height = 25; // Set domain row height
        domainRow.eachCell((cell) => {
          cell.style = domainRowStyle;
        });
        
        rowIndex++;

        for (const component of domainWithAnswers.components) {
          this.logger.log(`Processing component: ${component.name} with ${component.subComponents.length} sub-components`);
          this.logger.log(`Component data:`, JSON.stringify(component, null, 2));
          this.logger.log(`Component name: "${component.name}", Component code: "${component.code}"`);
          
          // Add component row - ALWAYS show component
          const componentName = component.name || component.description || 'Component Name';
          const componentRow = worksheet.addRow({
            code: component.code || `${domainWithAnswers.code || '1'}.A`,
            subcomponent: componentName,
            definition: '', // Empty for component rows
            status: '',
            evidence: '',
            reference: '',
          });
          
          // Apply styling to component row
          componentRow.height = 25; // Set component row height
          componentRow.eachCell((cell) => {
            cell.style = componentRowStyle;
          });
          
          rowIndex++;

          for (const subComponent of component.subComponents) {
            const answer = subComponent.answer;
            // Show sub-component even if no answer
            hasData = true;
            
            // Map status to numeric values
            let statusValue = '';
            if (answer?.measurementScale?.rate) {
              statusValue = answer.measurementScale.rate.toString();
            }
            
            // Clean up evidence and reference (remove HTML tags)
            const cleanEvidence = this.cleanHtmlContent(answer?.evidence || '');
            const cleanReference = this.cleanHtmlContent(answer?.reference || '');
            
            worksheet.addRow({
              code: subComponent.code || `${component.code || '1.A'}.1`,
              subcomponent: subComponent.name || 'Sub-Component Name',
              definition: subComponent.description || '', // Only sub-components have descriptions
              status: statusValue,
              evidence: cleanEvidence,
              reference: cleanReference,
            });
            
            // Apply white style for sub-components
            const subComponentRow = worksheet.getRow(rowIndex);
            subComponentRow.height = 20; // Set sub-component row height
            subComponentRow.eachCell((cell) => {
              cell.style = subComponentRowStyle;
            });
            rowIndex++;
          }
        }
      } else {
        const domains = await this.assessmentDomainService.getDomains(
          download.assessmentId,
          'en',
        );

        this.logger.log(`Processing ${domains.length} domains for assessment ${download.assessmentId}`);
        this.logger.log(`Domains data:`, JSON.stringify(domains, null, 2));

        for (const domain of domains) {
          const domainWithAnswers =
            await this.assessmentDomainService.getDomainWithAnswers(
              download.assessmentId,
              domain.id,
              'en',
            );

          this.logger.log(`Processing domain: ${domainWithAnswers.name} with ${domainWithAnswers.components.length} components`);
          this.logger.log(`Domain with answers data:`, JSON.stringify(domainWithAnswers, null, 2));
          this.logger.log(`Domain name: "${domainWithAnswers.name}", Domain code: "${domainWithAnswers.code}"`);

          // Add domain row - ALWAYS show domain
          const domainName = domainWithAnswers.name || domain.name || domainWithAnswers.description || domain.description || 'Domain Name';
          const domainRow = worksheet.addRow({
            code: domainWithAnswers.code || domain.code || '1',
            subcomponent: domainName,
            definition: '', // Empty for domain rows
            status: '',
            evidence: '',
            reference: '',
          });
          
          // Apply styling to domain row
          domainRow.height = 25; // Set domain row height
          domainRow.eachCell((cell) => {
            cell.style = domainRowStyle;
          });
          
          rowIndex++;

          for (const component of domainWithAnswers.components) {
            this.logger.log(`Processing component: ${component.name} with ${component.subComponents.length} sub-components`);
            this.logger.log(`Component data:`, JSON.stringify(component, null, 2));
            this.logger.log(`Component name: "${component.name}", Component code: "${component.code}"`);
            
            // Add component row - ALWAYS show component
            const componentName = component.name || component.description || 'Component Name';
            const componentRow = worksheet.addRow({
              code: component.code || `${domainWithAnswers.code || '1'}.A`,
              subcomponent: componentName,
              definition: '', // Empty for component rows
              status: '',
              evidence: '',
              reference: '',
            });
            
            // Apply styling to component row
            componentRow.height = 25; // Set component row height
            componentRow.eachCell((cell) => {
              cell.style = componentRowStyle;
            });
            
            rowIndex++;

            for (const subComponent of component.subComponents) {
              const answer = subComponent.answer;
              // Show sub-component even if no answer
              hasData = true;
              
              // Map status to numeric values
              let statusValue = '';
              if (answer?.measurementScale?.rate) {
                statusValue = answer.measurementScale.rate.toString();
              }
              
              // Clean up evidence and reference (remove HTML tags)
              const cleanEvidence = this.cleanHtmlContent(answer?.evidence || '');
              const cleanReference = this.cleanHtmlContent(answer?.reference || '');
              
              worksheet.addRow({
                code: subComponent.code || `${component.code || '1.A'}.1`,
                subcomponent: subComponent.name || 'Sub-Component Name',
                definition: subComponent.description || '', // Only sub-components have descriptions
                status: statusValue,
                evidence: cleanEvidence,
                reference: cleanReference,
              });
              
              // Apply white style for sub-components
              const subComponentRow = worksheet.getRow(rowIndex);
              subComponentRow.height = 20; // Set sub-component row height
              subComponentRow.eachCell((cell) => {
                cell.style = subComponentRowStyle;
              });
              rowIndex++;
            }
          }
        }
      }

      // If no data found, add a message row
      if (!hasData) {
        worksheet.addRow({
          code: '',
          subcomponent: 'No Data',
          definition: 'No answers found for this assessment',
          status: '',
          evidence: '',
          reference: '',
        });
        const noDataRow = worksheet.getRow(rowIndex);
        noDataRow.height = 20;
        noDataRow.eachCell((cell) => {
          cell.style = subComponentRowStyle;
        });
      }

      // Auto-fit rows and columns for better text display
      worksheet.columns.forEach((column) => {
        if (column.key) {
          const maxLength = Math.max(
            ...worksheet.getColumn(column.key).values
              .filter((value) => value != null)
              .map((value) => String(value).length)
          );
          column.width = Math.min(Math.max(maxLength + 2, column.width || 12), 50);
        }
      });

      // Auto-fit row heights
      worksheet.eachRow((row, rowNumber) => {
        row.height = 20; // Set minimum height
      });

      const filePath = download.domainId
        ? `downloads/assessment_${download.assessmentId}_domain_${download.domainId}_${download.id}.xlsx`
        : `downloads/assessment_${download.assessmentId}_${download.id}.xlsx`;
      const buffer = await workbook.xlsx.writeBuffer();

      // Store the buffer as base64 string in Redis
      await this.redis.setex(
        `download:${download.id}:file`,
        3600,
        Buffer.from(buffer).toString('base64'),
      );

      await manager.update(
        AssessmentDownload,
        { id: download.id },
        {
          status: DownloadStatus.READY,
          filePath,
        },
      );

      this.logger.log(`Excel file generated for download ${download.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to generate Excel for download ${download.id}: ${error.message}`,
      );
      await manager.update(
        AssessmentDownload,
        { id: download.id },
        {
          status: DownloadStatus.FAILED,
          errorMessage: error.message,
        },
      );
    }
  }

  // Helper method to clean HTML content
  private cleanHtmlContent(htmlContent: string): string {
    if (!htmlContent) return '';
    
    // Remove HTML tags and decode entities
    return htmlContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim(); // Remove extra whitespace
  }

  async getDownloadStatus(
    downloadId: string,
    userId: string,
  ): Promise<AssessmentDownload> {
    const download = await this.downloadRepository.findOne({
      where: { id: downloadId, userId },
    });
    if (!download) {
      throw new NotFoundException(`Download ${downloadId} not found`);
    }
    return download;
  }

  async downloadFile(
    downloadId: string,
    userId: string,
  ): Promise<{ file: Buffer; fileName: string }> {
    const download = await this.downloadRepository.findOne({
      where: { id: downloadId, userId },
    });
    if (!download) {
      throw new NotFoundException(`Download ${downloadId} not found`);
    }
    if (download.status !== DownloadStatus.READY) {
      throw new BadRequestException(
        `Download is not ready, current status: ${download.status}`,
      );
    }

    const fileBuffer = await this.redis.get(`download:${download.id}:file`);
    if (!fileBuffer) {
      throw new NotFoundException(
        `File for download ${downloadId} not found in Redis`,
      );
    }

    const fileName = download.domainId
      ? `assessment_${download.assessmentId}_domain_${download.domainId}_${download.id}.xlsx`
      : `assessment_${download.assessmentId}_${download.id}.xlsx`;

    return {
      file: Buffer.from(fileBuffer, 'base64'),
      fileName,
    };
  }
}
