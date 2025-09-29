import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, filter } from 'rxjs';

export interface MenuItem {
  title: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private currentRoute = '';
  private menuItems$ = new BehaviorSubject<MenuItem[]>([]);
  private router = inject(Router);

  // Mock mentors list - in a real app, this would come from a service
  private mentors = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects || event.url;
        this.updateMenuItems();
      });
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$.asObservable();
  }

  private updateMenuItems(): void {
    let items: MenuItem[] = [];

    if (this.currentRoute.startsWith('/admin')) {
      items = [
        { title: 'Dashboard', route: '/admin/dashboard', icon: '📊', exact: true },
        { title: 'Zarządzanie cytatami', route: '/admin/quotes', icon: '💬' },
      ];
    } else if (this.currentRoute.startsWith('/chat')) {
      // Return list of mentors for chat
      items = this.mentors.map(mentor => ({
        title: mentor.name,
        route: `/chat/${mentor.id}`,
        icon: '👤',
        exact: false,
      }));
    }

    this.menuItems$.next(items);
  }
}
