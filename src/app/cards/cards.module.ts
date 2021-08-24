import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityCardComponent } from './opportunity-card/opportunity-card.component';
import { Routes, RouterModule } from '@angular/router';
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';

export const routes: Routes = [
  {
    path: 'opportunityCard',
    component: OpportunityCardComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [OpportunityCardComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NovoElementsModule, NovoElementProviders.forChild()],
})
export class CardsModule {}
