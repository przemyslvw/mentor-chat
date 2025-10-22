import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { QuotesService, Quote, Tag, Category } from '../../../services/quotes.service';
import { MentorsService, Mentor } from '../../../services/mentors.service';
import { TagsService } from '../../../services/tags.service';
import { map, startWith, Observable } from 'rxjs';

interface QuoteForm {
  content: FormControl<string | null>;
  category: FormControl<string | null>;
  tags: FormControl<string[] | null>;
  isActive: FormControl<boolean | null>;
  source?: FormControl<string | null>;
  author?: FormControl<string | null>;
  context?: FormControl<string | null>;
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
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
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
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="quoteForm.get('category')?.hasError('required')">
            Kategoria jest wymagana
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Tagi</mat-label>
          <mat-chip-grid #chipGrid formControlName="tags">
            <mat-chip-row *ngFor="let tag of selectedTags" (removed)="removeTag(tag)">
              {{ getTagName(tag) }}
              <button matChipRemove [attr.aria-label]="'Usuń ' + getTagName(tag)">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
            <input
              #tagInput
              [matChipInputFor]="chipGrid"
              [matAutocomplete]="auto"
              [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
              (matChipInputTokenEnd)="add($event)"
              placeholder="Dodaj tag..."
            />
          </mat-chip-grid>
          <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
            <mat-option *ngFor="let tag of filteredTags$ | async" [value]="tag.id">
              {{ tag.name }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Źródło</mat-label>
          <input matInput formControlName="source" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Autor</mat-label>
          <input matInput formControlName="author" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Kontekst</mat-label>
          <textarea matInput formControlName="context" rows="2"></textarea>
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
  private readonly tagsService = inject(TagsService);
  private readonly fb = inject(FormBuilder);

  quoteForm!: FormGroup<QuoteForm>;
  isEdit = this.dialogData.isEdit;
  mentor: Mentor | undefined;
  categories: Category[] = [];
  allTags: Tag[] = [];
  selectedTags: string[] = [];
  filteredTags$!: Observable<Tag[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    // Initialize the form
    this.quoteForm = this.fb.group<QuoteForm>({
      content: this.fb.control('', [Validators.required, Validators.minLength(10)]),
      category: this.fb.control('', [Validators.required]),
      tags: this.fb.control<string[]>([]),
      isActive: this.fb.control(true),
      source: this.fb.control(''),
      author: this.fb.control(''),
      context: this.fb.control(''),
    });

    // Load categories and tags
    this.loadCategories();
    this.loadTags();

    // Set up tag filtering
    this.filteredTags$ = this.quoteForm.controls.tags.valueChanges.pipe(
      startWith(null),
      map((tag: string | string[] | null) => {
        const tagValue = Array.isArray(tag) ? null : tag;
        return tagValue
          ? this._filter(tagValue)
          : this.allTags.filter(t => !this.selectedTags.includes(t.id));
      }),
    );

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
        tags: this.dialogData.quote.tags || [],
        isActive: this.dialogData.quote.isActive,
        source: this.dialogData.quote.source || '',
        author: this.dialogData.quote.author || '',
        context: this.dialogData.quote.context || '',
      });
      this.selectedTags = [...(this.dialogData.quote.tags || [])];
    }
  }

  private loadCategories(): void {
    this.tagsService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: error => {
        console.error('Error loading categories:', error);
      },
    });
  }

  private loadTags(): void {
    this.tagsService.getTags().subscribe({
      next: tags => {
        this.allTags = tags;
        // If we have selected tags, make sure they're still valid
        if (this.selectedTags.length > 0) {
          this.selectedTags = this.selectedTags.filter(tagId =>
            this.allTags.some(tag => tag.id === tagId),
          );
          this.quoteForm.controls.tags.setValue([...this.selectedTags]);
        }
      },
      error: error => {
        console.error('Error loading tags:', error);
      },
    });
  }

  getTagName(tagId: string): string {
    const tag = this.allTags.find(t => t.id === tagId);
    return tag ? tag.name : tagId;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      // Check if tag exists
      const existingTag = this.allTags.find(tag => tag.name.toLowerCase() === value.toLowerCase());

      if (existingTag) {
        this._addTag(existingTag.id);
      } else {
        // Create new tag
        const newTag: Omit<Tag, 'id'> = { name: value };
        this.tagsService
          .addTag(newTag)
          .then(() => {
            // Reload tags to get the new one with ID
            this.loadTags();
            // Add the tag by name since we don't have the ID yet
            // It will be updated when tags are reloaded
            const tag = this.allTags.find(t => t.name.toLowerCase() === value.toLowerCase());
            if (tag) {
              this._addTag(tag.id);
            }
          })
          .catch(error => {
            console.error('Error creating tag:', error);
          });
      }
    }

    // Clear the input value
    if (event.input) {
      event.input.value = '';
    }
  }

  private _addTag(tagId: string): void {
    if (tagId && !this.selectedTags.includes(tagId)) {
      this.selectedTags.push(tagId);
      this.quoteForm.controls.tags.setValue([...this.selectedTags]);
    }
  }

  removeTag(tagId: string): void {
    const index = this.selectedTags.indexOf(tagId);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.quoteForm.controls.tags.setValue([...this.selectedTags]);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this._addTag(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.quoteForm.controls.tags.setValue(null);
  }

  private _filter(value: string | null): Tag[] {
    if (!value) return this.allTags.filter(tag => !this.selectedTags.includes(tag.id));

    const filterValue = value.toLowerCase();
    return this.allTags.filter(
      tag => tag.name.toLowerCase().includes(filterValue) && !this.selectedTags.includes(tag.id),
    );
  }

  async onSubmit(): Promise<void> {
    if (this.quoteForm.valid && this.dialogData.mentorId) {
      const formValue = this.quoteForm.getRawValue();
      const now = new Date();

      const quoteData: Omit<Quote, 'id' | 'mentorId'> = {
        content: formValue.content || '',
        category: formValue.category || '',
        tags: this.selectedTags,
        isActive: formValue.isActive ?? true,
        source: formValue.source || undefined,
        author: formValue.author || undefined,
        context: formValue.context || undefined,
        createdAt:
          this.isEdit && this.dialogData.quote?.createdAt ? this.dialogData.quote.createdAt : now,
        updatedAt: now,
      } as Omit<Quote, 'id' | 'mentorId'>;

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
