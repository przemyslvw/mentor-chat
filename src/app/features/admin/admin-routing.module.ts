import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuotesComponent } from './components/quotes/quotes.component';
import { EmbeddingsComponent } from './components/embeddings/embeddings.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'quotes',
    component: QuotesComponent,
    data: { title: 'Zarządzanie cytatami' },
  },
  {
    path: 'embeddings',
    component: EmbeddingsComponent,
    data: { title: 'Podgląd embeddingów' },
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
