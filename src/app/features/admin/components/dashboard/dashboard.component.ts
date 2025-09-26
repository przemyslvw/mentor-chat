import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <h2>Admin Dashboard</h2>
      <div class="dashboard-content">
        <p>Welcome to the admin dashboard. This is a protected route.</p>
        <div class="stats">
          <div class="stat-card">
            <h3>Users</h3>
            <div class="stat-value">1,234</div>
          </div>
          <div class="stat-card">
            <h3>Messages</h3>
            <div class="stat-value">5,678</div>
          </div>
          <div class="stat-card">
            <h3>Active Now</h3>
            <div class="stat-value">42</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    
    .dashboard-content {
      margin-top: 20px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-card h3 {
      margin-top: 0;
      color: #6c757d;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }
  `]
})
export class DashboardComponent {
  // Dashboard logic will go here
}
