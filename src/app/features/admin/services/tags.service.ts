import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag, Category } from './quotes.service';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private readonly tagsCollection = 'tags';
  private readonly categoriesCollection = 'categories';

  private firestore = inject(Firestore);

  // Tags CRUD
  getTags(): Observable<Tag[]> {
    const tagsRef = collection(this.firestore, this.tagsCollection);
    const q = query(tagsRef, orderBy('name'));
    return collectionData(q, { idField: 'id' }) as Observable<Tag[]>;
  }

  addTag(tag: Omit<Tag, 'id'>): Promise<void> {
    const tagRef = doc(collection(this.firestore, this.tagsCollection));
    return setDoc(tagRef, { ...tag });
  }

  updateTag(id: string, tag: Partial<Tag>): Promise<void> {
    const tagRef = doc(this.firestore, this.tagsCollection, id);
    return setDoc(tagRef, { ...tag }, { merge: true });
  }

  deleteTag(id: string): Promise<void> {
    const tagRef = doc(this.firestore, this.tagsCollection, id);
    return deleteDoc(tagRef);
  }

  // Categories CRUD
  getCategories(): Observable<Category[]> {
    const categoriesRef = collection(this.firestore, this.categoriesCollection);
    const q = query(categoriesRef, orderBy('name'));
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  addCategory(category: Omit<Category, 'id'>): Promise<void> {
    const categoryRef = doc(collection(this.firestore, this.categoriesCollection));
    return setDoc(categoryRef, { ...category });
  }

  updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const categoryRef = doc(this.firestore, this.categoriesCollection, id);
    return setDoc(categoryRef, { ...category }, { merge: true });
  }

  deleteCategory(id: string): Promise<void> {
    const categoryRef = doc(this.firestore, this.categoriesCollection, id);
    return deleteDoc(categoryRef);
  }

  // Helper methods
  getTagsByIds(tagIds: string[]): Observable<Tag[]> {
    if (!tagIds || tagIds.length === 0) {
      return new Observable(subscriber => subscriber.next([]));
    }

    return this.getTags().pipe(map(tags => tags.filter(tag => tagIds.includes(tag.id))));
  }

  getCategoryById(categoryId: string): Observable<Category | undefined> {
    return this.getCategories().pipe(
      map(categories => categories.find(cat => cat.id === categoryId)),
    );
  }
}
