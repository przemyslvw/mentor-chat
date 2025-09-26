import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  setLoading(loading: boolean): void {
    // Add a small delay to prevent flickering for fast requests
    if (loading) {
      this.loadingSubject.next(true);
    } else {
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, 200);
    }
  }
}
