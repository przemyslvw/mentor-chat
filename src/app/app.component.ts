import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-header class="header"></app-header>
      <div class="layout-container">
        <app-sidebar class="sidebar"></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .layout-container {
      display: flex;
      flex: 1;
      background-color: #f5f7fa;
    }

    .sidebar {
      width: 250px;
      flex-shrink: 0;
      background-color: #2c3e50;
      color: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      background-color: #ffffff;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        height: 100%;
        z-index: 90;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
        width: 100%;
      }
    }
  `]
})
export class AppComponent {
  title = 'mentor-chat';
}
