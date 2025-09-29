import { Injectable } from '@angular/core';

export interface QuoteData {
  content: string;
  author?: string;
  category?: string;
  tags?: string[];
  isActive?: boolean;
  // Add other quote properties as needed
}

export interface FileUploadError<T = unknown> {
  line: number;
  error: string;
  data: T;
}

export interface FileUploadResult<T = QuoteData> {
  success: boolean;
  message: string;
  data?: T[];
  errors?: FileUploadError<T>[];
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  async parseFile(file: File): Promise<FileUploadResult<QuoteData>> {
    try {
      if (!file) {
        return {
          success: false,
          message: 'No file provided',
          errors: [
            {
              line: 0,
              error: 'No file provided',
              data: { content: 'N/A', fileName: 'unknown' } as QuoteData,
            },
          ],
        };
      }

      const fileType = file.name.split('.').pop()?.toLowerCase() || '';

      if (fileType === 'csv') {
        return this.parseCSV(file);
      } else if (fileType === 'json') {
        return this.parseJSON(file);
      } else {
        return {
          success: false,
          message: 'Unsupported file type',
          errors: [
            {
              line: 0,
              error: 'Unsupported file type',
              data: { content: 'N/A', fileName: file.name } as QuoteData,
            },
          ],
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const fileName = file?.name || 'unknown';
      return {
        success: false,
        message: 'Error parsing file',
        errors: [
          {
            line: 0,
            error: errorMessage,
            data: { content: 'N/A', error: errorMessage, fileName } as QuoteData,
          },
        ],
      };
    }
  }

  private async parseCSV(file: File): Promise<FileUploadResult<QuoteData>> {
    return new Promise(resolve => {
      const reader = new FileReader();
      const result: FileUploadResult<QuoteData> = {
        success: false,
        message: '',
        data: [],
        errors: [],
      };

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const target = event.target;
          if (!target?.result) {
            throw new Error('Failed to read file');
          }

          const csvData = target.result as string;
          const lines = csvData.split('\n').filter(line => line.trim() !== '');

          if (lines.length === 0) {
            result.success = false;
            result.message = 'Empty file';
            result.errors?.push({
              line: 0,
              error: 'The file is empty',
              data: { content: 'N/A', fileName: file.name } as QuoteData,
            });
            resolve(result);
            return;
          }

          // Process header row
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

          // Process data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = this.parseCSVLine(line);
            const quote: Partial<QuoteData> = {};
            let hasError = false;

            // Map CSV columns to quote properties
            headers.forEach((header, index) => {
              if (index >= values.length) return;

              const value = values[index]?.trim();

              // Required field validation
              if (header === 'content' && !value) {
                result.errors?.push({
                  line: i + 1,
                  error: 'Missing required field: content',
                  data: { content: line || 'N/A', rawLine: line } as QuoteData,
                });
                hasError = true;
                return;
              }

              // Type conversion and assignment
              try {
                switch (header) {
                  case 'tags':
                    if (value) {
                      quote.tags = value
                        .split(';')
                        .map(tag => tag.trim())
                        .filter(tag => tag);
                    }
                    break;
                  case 'isactive':
                    quote.isActive = value?.toLowerCase() === 'true';
                    break;
                  default:
                    // Only assign to known properties
                    if (['content', 'author', 'category', 'tags', 'isActive'].includes(header)) {
                      (quote as Record<string, unknown>)[header] = value;
                    }
                }
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                result.errors?.push({
                  line: i + 1,
                  error: `Error processing ${header}: ${errorMessage}`,
                  data: {
                    content: value || 'N/A',
                    [header]: value,
                    error: errorMessage,
                  } as QuoteData,
                });
                hasError = true;
              }
            });

            // If no errors, add the quote to valid data
            if (!hasError && quote.content) {
              result.data?.push(quote as QuoteData);
            }
          }

          // Set final result
          result.success = result.errors?.length === 0;
          result.message = result.success
            ? 'CSV file processed successfully'
            : `Processed with ${result.errors?.length} errors`;

          resolve(result);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors?.push({
            line: 0,
            error: errorMessage,
            data: { content: 'N/A', error: errorMessage } as QuoteData,
          });
          result.success = false;
          result.message = 'Error processing CSV file';
          resolve(result);
        }
      };

      reader.onerror = () => {
        result.success = false;
        result.message = 'Error reading file';
        result.errors?.push({
          line: 0,
          error: 'Failed to read file content',
          data: { content: 'N/A', fileName: file.name } as QuoteData,
        });
        resolve(result);
      };

      reader.readAsText(file);
    });
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Add the last field
    if (current || line[line.length - 1] === ',') {
      result.push(current);
    }

    return result;
  }

  private async parseJSON(file: File): Promise<FileUploadResult<QuoteData>> {
    try {
      const content = await file.text();
      const data = JSON.parse(content);

      if (!Array.isArray(data)) {
        return {
          success: false,
          message: 'Invalid JSON format. Expected an array of quotes.',
          errors: [
            {
              line: 0,
              error: 'Root element must be an array',
              data: { content: 'N/A', type: typeof data } as QuoteData,
            },
          ],
        };
      }

      // Validate each quote
      const errors: FileUploadError<QuoteData>[] = [];
      const validData: QuoteData[] = [];

      data.forEach((item: unknown, index: number) => {
        if (typeof item !== 'object' || item === null) {
          errors.push({
            line: index + 1,
            error: 'Invalid quote format',
            data: {
              content: 'N/A',
              error: 'Expected an object',
              value: JSON.stringify(item),
            } as unknown as QuoteData,
          });
          return;
        }

        const quote = item as Partial<QuoteData>;

        if (!quote.content) {
          errors.push({
            line: index + 1,
            error: 'Missing required field: content',
            data: { content: 'N/A', ...quote } as QuoteData,
          });
          return;
        }

        try {
          // Ensure required fields and proper types
          const validQuote: QuoteData = {
            content: String(quote.content),
            author: quote.author !== undefined ? String(quote.author) : undefined,
            category: quote.category !== undefined ? String(quote.category) : undefined,
            tags: Array.isArray(quote.tags)
              ? quote.tags.map((tag: unknown) => String(tag))
              : quote.tags !== undefined
                ? [String(quote.tags)]
                : undefined,
            isActive: Boolean(quote.isActive),
          };

          validData.push(validQuote);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push({
            line: index + 1,
            error: `Error processing quote: ${errorMessage}`,
            data: { content: quote.content || 'N/A', ...quote } as QuoteData,
          });
        }
      });

      return {
        success: errors.length === 0,
        message:
          errors.length > 0
            ? `Processed with ${errors.length} error${errors.length === 1 ? '' : 's'}`
            : 'File processed successfully',
        data: validData.length > 0 ? validData : undefined,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error parsing JSON file:', error);
      return {
        success: false,
        message: 'Error parsing JSON file',
        errors: [
          {
            line: 0,
            error: errorMessage,
            data: { content: 'N/A', error: errorMessage, fileName: file.name } as QuoteData,
          },
        ],
      };
    }
  }
}
