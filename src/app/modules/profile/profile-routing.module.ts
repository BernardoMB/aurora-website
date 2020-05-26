import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { EditCreditCardsComponent } from './components/edit-credit-cards/edit-credit-cards.component';
import { AuthGuard } from '../../guards/auth.guard';


const routes: Routes = [
  { path: '', component: ProfileComponent, canActivate: [AuthGuard],  children: [
    { path: '', redirectTo: 'edit-profile', pathMatch: 'full' },
    { path: 'edit-profile', component: EditProfileComponent },
    /// { path: 'edit-photo', component: EditPhotoComponent },
    { path: 'edit-account', component: EditAccountComponent },
    { path: 'edit-credit-cards', component: EditCreditCardsComponent },
    // { path: 'edit-privacy', component: EditPrivacyComponent }
    // { path: 'edit-notifications', component: EditNotificationsComponent }
    // { path: 'edit-api'clients', component: EditApiClientsComponent }
    // { path: 'close-account, component: CloseAccountComponent }
  ]},
  // { path: ':publicProfilePath', component: PublicProfile } // This route does not requires authentication guard.
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
