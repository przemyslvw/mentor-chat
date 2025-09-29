import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { QuotesService, Quote } from '../../../services/quotes.service';
import { MentorsService, Mentor } from '../../../services/mentors.service';

interface QuoteForm {
  content: FormControl<string | null>;
  category: FormControl<string | null>;
  isActive: FormControl<boolean | null>;
}

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edytuj cytat' : 'Dodaj nowy cytat' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="quoteForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Treść cytatu</mat-label>
          <textarea matInput formControlName="content" rows="4" required></textarea>
          <mat-error *ngIf="quoteForm.get('content')?.hasError('required')">
            Treść jest wymagana
          </mat-error>
          <mat-error *ngIf="quoteForm.get('content')?.hasError('minlength')">
            Treść musi mieć co najmniej 10 znaków
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Kategoria</mat-label>
          <mat-select formControlName="category" required>
            <mat-option *ngFor="let category of categories" [value]="category">
              {{ category }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="quoteForm.get('category')?.hasError('required')">
            Kategoria jest wymagana
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="isActive" color="primary"> Aktywny </mat-checkbox>

        <div class="flex justify-end gap-2 mt-4">
          <button mat-button type="button" (click)="onCancel()">Anuluj</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!quoteForm.valid">
            {{ isEdit ? 'Zapisz zmiany' : 'Dodaj cytat' }}
          </button>
        </div>
      </form>
    </mat-dialog-content>
  `,
  styles: [
    `
      .w-full {
        width: 100%;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class QuoteFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<QuoteFormComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA) as {
    isEdit: boolean;
    quote?: Quote;
    mentorId: string;
  };

  private readonly quotesService = inject(QuotesService);
  private readonly mentorsService = inject(MentorsService);
  private readonly fb = inject(FormBuilder);

  quoteForm!: FormGroup<QuoteForm>;
  isEdit = this.dialogData.isEdit;
  mentor: Mentor | undefined;

  categories = ['Motywacja', 'Sukces', 'Praca', 'Życie', 'Miłość', 'Inne'] as const;

  ngOnInit(): void {
    // Initialize the form
    this.quoteForm = this.fb.group<QuoteForm>({
      content: this.fb.control('', [Validators.required, Validators.minLength(10)]),
      category: this.fb.control('', [Validators.required]),
      isActive: this.fb.control(true),
    });

    // Load mentor details
    if (this.dialogData.mentorId) {
      this.mentorsService.getMentors().subscribe({
        next: (mentors: Mentor[]) => {
          this.mentor = mentors.find((m: Mentor) => m.id === this.dialogData.mentorId);
        },
        error: (error: Error) => {
          console.error('Error loading mentor:', error);
        },
      });
    }

    // Patch values if in edit mode
    if (this.isEdit && this.dialogData.quote) {
      this.quoteForm.patchValue({
        content: this.dialogData.quote.content,
        category: this.dialogData.quote.category,
        isActive: this.dialogData.quote.isActive,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.quoteForm.valid && this.dialogData.mentorId) {
      const formValue = this.quoteForm.getRawValue();
      const quoteData: Omit<Quote, 'id' | 'mentorId' | 'createdAt' | 'updatedAt'> = {
        content: formValue.content || '',
        category: formValue.category || '',
        isActive: formValue.isActive ?? true,
      };

      try {
        if (this.isEdit && this.dialogData.quote?.id) {
          await this.quotesService.updateQuote(this.dialogData.quote.id, quoteData);
          this.dialogRef.close(true);
        } else {
          await this.quotesService.addQuote(this.dialogData.mentorId, quoteData);
          this.dialogRef.close(true);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Wystąpił nieznany błąd';
        console.error('Wystąpił błąd:', errorMessage);
        // Here you could add error handling, e.g. show a snackbar
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
