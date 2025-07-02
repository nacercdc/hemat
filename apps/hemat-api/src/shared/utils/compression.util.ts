import * as zlib from 'zlib';
import { Logger } from '@nestjs/common';

const logger = new Logger('CompressionUtil');

/**
 * Utility class for text compression operations
 */
export class CompressionUtil {
  /**
   * Compresses text using gzip and returns base64 encoded string
   * @param text Text to compress
   * @param options Optional compression options
   * @returns Compressed text as base64 string
   */
  static compressText(
    text: string,
    options: {
      minSizeToCompress?: number; // Only compress if text is larger than this size (in bytes)
      logCompression?: boolean; // Whether to log compression stats
    } = {},
  ): { data: string; isCompressed: boolean } {
    const { minSizeToCompress = 0, logCompression = false } = options;

    if (!text) {
      return { data: '', isCompressed: false };
    }

    // Don't compress small texts
    if (text.length < minSizeToCompress) {
      return { data: text, isCompressed: false };
    }

    try {
      // Use gzip compression
      const compressed = zlib.gzipSync(Buffer.from(text)).toString('base64');
      const originalSize = text.length;
      const compressedSize = compressed.length;

      if (logCompression) {
        logger.debug(
          `Compressed text from ${originalSize} to ${compressedSize} bytes (${Math.round(
            (compressedSize / originalSize) * 100,
          )}%)`,
        );
      }

      return { data: compressed, isCompressed: true };
    } catch (error) {
      logger.error('Error compressing text:', error);
      return { data: text, isCompressed: false };
    }
  }

  /**
   * Decompresses text that was compressed with compressText
   * @param compressedText Base64 encoded compressed text
   * @returns Original text
   */
  static decompressText(compressedText: string): string {
    if (!compressedText) return '';

    try {
      const compressed = Buffer.from(compressedText, 'base64');
      return zlib.gunzipSync(compressed).toString();
    } catch (error) {
      logger.error('Error decompressing text:', error);
      return compressedText; // Return original text if decompression fails
    }
  }
} 