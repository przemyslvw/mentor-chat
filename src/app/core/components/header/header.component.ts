import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <nav class="navbar">
        <div class="logo">Mentor Chat</div>
        <div class="nav-links">
          <a routerLink="/chat" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Chat</a>
          <a routerLink="/admin" routerLinkActive="active">Admin</a>
          <a routerLink="/auth/login" routerLinkActive="active">Login</a>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: #1976d2;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .navbar {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 0;
      position: relative;
      transition: opacity 0.2s;
    }
    
    .nav-links a:hover {
      opacity: 0.9;
    }
    
    .nav-links a.active {
      font-weight: 500;
    }
    
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: white;
    }
  `]
})
export class HeaderComponent {
  // Navigation logic can be added here
}
