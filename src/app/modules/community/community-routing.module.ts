import { Routes, RouterModule } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { NgModule } from '@angular/core';
import { ReactionsResolver } from './resolvers/reactions.resolver';

export const routes: Routes = [
  {
    path: '',
    resolve: { reactions: ReactionsResolver },
    component: CommunityComponent,
    data: { animation: 'courses' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
