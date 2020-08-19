import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityComponent } from './community/community.component';
import { CommunityRoutingModule } from './community-routing.module';
import { SocialInteractionCardComponent } from './components/social-interaction-card/social-interaction-card.component';
import { ReactionsResolver } from './resolvers/reactions.resolver';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { CommunityCardComponent } from './components/community-card/community-card.component';
import { EventCommunityCardComponent } from './components/event-community-card/event-community-card.component';
import { ArticleCommunityCardComponent } from './components/article-community-card/article-community-card.component';
import { CourseCommunityCardComponent } from './components/course-community-card/course-community-card.component';

@NgModule({
  declarations: [CommunityComponent, SocialInteractionCardComponent, CommunityCardComponent, EventCommunityCardComponent, ArticleCommunityCardComponent, CourseCommunityCardComponent],
  imports: [CommonModule, CommunityRoutingModule, SharedModule, MaterialModule],
  providers: [ReactionsResolver],
})
export class CommunityModule {}
