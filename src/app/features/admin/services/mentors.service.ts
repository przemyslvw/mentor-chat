import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Mentor {
  id?: string;
  name: string;
  title: string;
  bio: string;
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class MentorsService {
  private readonly collectionName = 'mentors';

  private readonly firestore = inject(Firestore);

  getMentors(): Observable<Mentor[]> {
    const mentorsRef = collection(this.firestore, this.collectionName);
    return collectionData(mentorsRef, { idField: 'id' }) as Observable<Mentor[]>;
  }

  getActiveMentors(): Observable<Mentor[]> {
    // This would need a proper query in a real implementation
    return this.getMentors();
  }

  async addMentor(mentor: Omit<Mentor, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const mentorsRef = collection(this.firestore, this.collectionName);
    const now = new Date();
    await addDoc(mentorsRef, {
      ...mentor,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateMentor(
    id: string,
    mentor: Partial<Omit<Mentor, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    const mentorRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(mentorRef, {
      ...mentor,
      updatedAt: new Date(),
    });
  }

  async deleteMentor(id: string): Promise<void> {
    const mentorRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(mentorRef);
  }
}
