import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssessmentGroupDomainsJoinTable1752000000000 implements MigrationInterface {
    name = 'AddAssessmentGroupDomainsJoinTable1752000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assessment_group_domains" (
            "groupId" uuid NOT NULL,
            "domainId" uuid NOT NULL,
            CONSTRAINT "PK_assessment_group_domains" PRIMARY KEY ("groupId", "domainId"),
            CONSTRAINT "FK_group" FOREIGN KEY ("groupId") REFERENCES "assessment_groups"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_domain" FOREIGN KEY ("domainId") REFERENCES "assessment-domains"("id") ON DELETE CASCADE
        )`);
        await queryRunner.query(`CREATE INDEX "IDX_groupId" ON "assessment_group_domains" ("groupId")`);
        await queryRunner.query(`CREATE INDEX "IDX_domainId" ON "assessment_group_domains" ("domainId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_domainId"`);
        await queryRunner.query(`DROP INDEX "IDX_groupId"`);
        await queryRunner.query(`DROP TABLE "assessment_group_domains"`);
    }
} 