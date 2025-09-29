import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadService } from '../../../../../shared/services/file-upload.service';

interface QuoteData {
  content: string;
  author: string;
  category: string;
  tags: string[];
  isActive: boolean;
  id?: string;
  mentorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FileUploadResult<T = QuoteData> {
  success: boolean;
  message: string;
  data?: T[];
  errors?: {
    line: number;
    error: string;
    data: T;
  }[];
}
import { QuotesService } from '../../../services/quotes.service';
import { FileSizePipe } from '../../../../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-quote-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FileSizePipe,
  ],
  templateUrl: './quote-upload.component.html',
  styleUrls: ['./quote-upload.component.scss'],
})
export class QuoteUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  uploadResult: FileUploadResult | null = null;
  private readonly fileUploadService = inject(FileUploadService);
  private readonly quotesService = inject(QuotesService);
  private readonly dialogRef = inject(MatDialogRef<QuoteUploadComponent>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly snackBar = inject(MatSnackBar);

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.uploadResult = null;
    }
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      this.showError('Please select a file to upload');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadResult = null;

    try {
      // Parse the file
      const result = (await this.fileUploadService.parseFile(
        this.selectedFile,
      )) as FileUploadResult<QuoteData>;
      this.uploadResult = result;

      if (!result.success || !result.data?.length) {
        throw new Error(result.message || 'Failed to parse file');
      }

      // Process upload in chunks
      const chunkSize = 10;
      const chunks = this.chunkArray(result.data, chunkSize);
      let uploadedCount = 0;

      for (const chunk of chunks) {
        await this.processChunk(chunk);
        uploadedCount += chunk.length;
        this.uploadProgress = Math.round((uploadedCount / result.data.length) * 100);
      }

      this.showSuccess(`Successfully uploaded ${uploadedCount} quotes`);
      this.dialogRef.close(true);
    } catch (error) {
      console.error('Upload error:', error);
      this.showError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isUploading = false;
    }
  }

  private async processChunk(chunk: QuoteData[]): Promise<void> {
    const batch = chunk.map(quote => {
      // Ensure all required fields have default values
      const processedQuote = {
        content: quote.content,
        author: quote.author || 'Unknown',
        category: quote.category || 'General',
        tags: quote.tags || [],
        isActive: quote.isActive ?? true,
      };
      return this.quotesService.addQuote('batch-upload', processedQuote);
    });
    await Promise.all(batch);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  get hasErrors(): boolean {
    return !!this.uploadResult?.errors?.length;
  }

  get hasWarnings(): boolean {
    return (this.uploadResult?.data?.length || 0) < (this.uploadResult?.errors?.length || 0);
  }

  downloadErrors(): void {
    if (!this.uploadResult?.errors?.length) return;

    const errorData = this.uploadResult.errors;
    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'upload-errors.json';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
