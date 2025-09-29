import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Quote {
  id?: string;
  mentorId: string;
  content: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private readonly collectionName = 'quotes';

  private readonly firestore = inject(Firestore);

  getQuotesByMentor(mentorId: string): Observable<Quote[]> {
    const quotesRef = collection(this.firestore, this.collectionName);
    const q = query(quotesRef, where('mentorId', '==', mentorId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Quote[]>;
  }

  async addQuote(
    mentorId: string,
    quoteData: Omit<Quote, 'id' | 'mentorId' | 'createdAt' | 'updatedAt'>,
  ): Promise<void> {
    const quotesRef = collection(this.firestore, this.collectionName);
    const now = new Date();
    await addDoc(quotesRef, {
      ...quoteData,
      mentorId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateQuote(
    id: string,
    quoteData: Partial<Omit<Quote, 'id' | 'mentorId' | 'createdAt'>>,
  ): Promise<void> {
    const quoteRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(quoteRef, {
      ...quoteData,
      updatedAt: new Date(),
    });
  }

  async deleteQuote(id: string): Promise<void> {
    const quoteRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(quoteRef);
  }
}
