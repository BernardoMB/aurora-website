import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { EditCreditCardsComponent } from './components/edit-credit-cards/edit-credit-cards.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';


@NgModule({
  declarations: [ProfileComponent, EditProfileComponent, EditAccountComponent, EditCreditCardsComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class ProfileModule { }
