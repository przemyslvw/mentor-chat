import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuotesService, Quote } from '../../services/quotes.service';
import { MentorsService, Mentor } from '../../services/mentors.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuoteFormComponent } from './quote-form/quote-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TruncatePipe } from '../../../../shared/pipes/truncate/truncate.pipe';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    TruncatePipe,
  ] as const,
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  mentors: Mentor[] = [];
  selectedMentorId: string | null = null;

  displayedColumns: string[] = ['content', 'category', 'isActive', 'actions'];

  private readonly quotesService = inject(QuotesService);
  private readonly mentorsService = inject(MentorsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadMentors();
  }

  loadMentors(): void {
    this.mentorsService.getMentors().subscribe((mentors: Mentor[]) => {
      this.mentors = mentors;
      if (mentors.length > 0) {
        this.selectedMentorId = mentors[0].id || null;
        this.loadQuotes();
      }
    });
  }

  onMentorChange(): void {
    this.loadQuotes();
  }

  loadQuotes(): void {
    if (!this.selectedMentorId) return;

    this.quotesService.getQuotesByMentor(this.selectedMentorId).subscribe({
      next: (quotes: Quote[]) => {
        this.quotes = quotes;
      },
      error: (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
        console.error('Błąd podczas ładowania cytatów:', errorMessage);
        this.showMessage('Wystąpił błąd podczas ładowania cytatów', true);
      },
    });
  }

  openAddDialog(): void {
    if (!this.selectedMentorId) {
      this.showMessage('Proszę wybrać mentora', true);
      return;
    }

    const dialogRef = this.dialog.open(QuoteFormComponent, {
      width: '600px',
      data: {
        isEdit: false,
        mentorId: this.selectedMentorId,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadQuotes();
        this.showMessage('Cytat został dodany pomyślnie');
      }
    });
  }

  openEditDialog(quote: Quote): void {
    const dialogRef = this.dialog.open(QuoteFormComponent, {
      width: '600px',
      data: {
        isEdit: true,
        quote: { ...quote },
        mentorId: this.selectedMentorId,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadQuotes();
        this.showMessage('Cytat został zaktualizowany pomyślnie');
      }
    });
  }

  async deleteQuote(id: string): Promise<void> {
    if (confirm('Czy na pewno chcesz usunąć ten cytat?')) {
      try {
        await this.quotesService.deleteQuote(id);
        this.loadQuotes();
        this.showMessage('Cytat został usunięty pomyślnie');
      } catch (error: unknown) {
        console.error('Błąd podczas usuwania cytatu:', error);
        this.showMessage('Wystąpił błąd podczas usuwania cytatu', true);
      }
    }
  }

  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: isError ? 'error-snackbar' : 'success-snackbar',
    });
  }
}
