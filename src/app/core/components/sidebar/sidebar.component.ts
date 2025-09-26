import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar">
      <ul class="nav-links">
        <li>
          <a routerLink="/chat" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <i class="icon">💬</i>
            <span>Chat</span>
          </a>
        </li>
        <li>
          <a routerLink="/admin" routerLinkActive="active">
            <i class="icon">👨‍💼</i>
            <span>Admin</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100%;
      background-color: #2c3e50;
      color: #ecf0f1;
      padding: 1rem 0;
    }

    .nav-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-links a {
      display: flex;
      align-items: center;
      padding: 0.8rem 1.5rem;
      color: #ecf0f1;
      text-decoration: none;
      transition: background-color 0.3s;
    }

    .nav-links a:hover {
      background-color: #34495e;
    }

    .nav-links a.active {
      background-color: #3498db;
    }

    .icon {
      margin-right: 10px;
      font-size: 1.2em;
    }
  `]
})
export class SidebarComponent {}
