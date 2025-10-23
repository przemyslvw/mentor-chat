import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';

interface EmbeddingDocument {
  id?: string;
  text?: string;
  embedding?: number[];
  similarity?: number;
}

@Component({
  selector: 'app-embeddings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Embedding Preview & Testing</h2>

      <!-- Search Section -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Test Similarity Search</h3>
        <div class="flex gap-2">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Enter search query"
            class="flex-1 p-2 border rounded"
            (keyup.enter)="onSearch()"
          />
          <button
            (click)="onSearch()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            [disabled]="isSearching"
          >
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div *ngIf="searchResults.length > 0" class="mt-6">
        <h3 class="text-lg font-semibold mb-3">Search Results</h3>
        <div class="space-y-4">
          <div *ngFor="let result of searchResults" class="p-4 border rounded-lg hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Similarity: {{ (result.similarity * 100).toFixed(1) }}%</p>
                <p class="text-gray-700 mt-1">{{ result.document.text }}</p>
              </div>
              <button
                (click)="showEmbeddingDetails = !showEmbeddingDetails"
                class="text-sm text-blue-500 hover:underline"
              >
                {{ showEmbeddingDetails ? 'Hide' : 'Show' }} Embedding
              </button>
            </div>

            <div
              *ngIf="showEmbeddingDetails"
              class="mt-3 p-3 bg-gray-50 rounded text-xs overflow-auto"
            >
              <p class="font-mono text-xs">
                {{
                  result.document.embedding
                    ? result.document.embedding.slice(0, 10).join(', ') + '...'
                    : 'No embedding data'
                }}
                <span *ngIf="result.document.embedding" class="text-gray-500">
                  ({{ result.document.embedding.length }} dimensions)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Section -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-3">Embedding Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-white rounded-lg shadow">
            <p class="text-gray-500">Total Documents</p>
            <p class="text-2xl font-bold">
              <ng-container *ngIf="documents$ | async as documents; else loading">
                {{ documents.length }}
              </ng-container>
              <ng-template #loading>Loading...</ng-template>
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg shadow">
            <p class="text-gray-500">Vector Dimensions</p>
            <p class="text-2xl font-bold">
              <ng-container *ngIf="documents$ | async as documents; else loadingDims">
                {{ documents[0] && documents[0].embedding ? documents[0].embedding.length : 'N/A' }}
              </ng-container>
              <ng-template #loadingDims>Loading...</ng-template>
            </p>
          </div>
          <div class="p-4 bg-white rounded-lg shadow">
            <p class="text-gray-500">Last Updated</p>
            <p class="text-lg">{{ lastUpdated | date: 'medium' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class EmbeddingsComponent implements OnInit {
  documents$!: Observable<EmbeddingDocument[]>;
  searchQuery = '';
  searchResults: { document: EmbeddingDocument; similarity: number }[] = [];
  isSearching = false;
  showEmbeddingDetails = false;
  lastUpdated = new Date();

  private firestore: Firestore = inject(Firestore);
  private functions: Functions = inject(Functions);

  ngOnInit() {
    this.loadDocuments();
  }

  private loadDocuments() {
    const collectionRef = collection(this.firestore, 'quotes');
    this.documents$ = collectionData(collectionRef, { idField: 'id' }) as Observable<
      EmbeddingDocument[]
    >;

    // Initialize with empty array to prevent template errors
    this.documents$.subscribe({
      next: docs => {
        if (!docs || docs.length === 0) {
          this.documents$ = new Observable<EmbeddingDocument[]>(subscriber => {
            subscriber.next([]);
            subscriber.complete();
          });
        }
      },
      error: err => {
        console.error('Error loading documents:', err);
        this.documents$ = new Observable<EmbeddingDocument[]>(subscriber => {
          subscriber.next([]);
          subscriber.complete();
        });
      },
    });
  }

  async onSearch() {
    if (!this.searchQuery.trim()) return;

    this.isSearching = true;
    this.searchResults = [];

    try {
      type SearchResponse = { document: EmbeddingDocument; similarity: number }[];

      const searchFn = httpsCallable<
        { query: string; collection: string; fieldToSearch: string; limit: number },
        SearchResponse
      >(this.functions, 'findSimilarDocuments');

      const result = await searchFn({
        query: this.searchQuery,
        collection: 'quotes',
        fieldToSearch: 'embedding',
        limit: 5,
      });

      this.searchResults = result.data as SearchResponse;
      this.lastUpdated = new Date();
    } catch (error: unknown) {
      console.error('Error searching documents:', error);
    } finally {
      this.isSearching = false;
    }
  }
}
