import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { Step1Component } from './_components/step1/step1.component';
import { Step2Component } from './_components/step2/step2.component';
import { Step3Component } from './_components/step3/step3.component';
import { Step4Component } from './_components/step4/step4.component';
import { AuthGuard } from './_services/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'step-1', component: Step1Component, canActivate: [AuthGuard] },
  { path: 'step-2', component: Step2Component },
  { path: 'step-3', component: Step3Component, canActivate: [AuthGuard] },
  { path: 'step-4', component: Step4Component, canActivate: [AuthGuard] },
  //{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  //{ path: 'detail/:bookID', component: DetailComponent },
  //{ path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { expectedRole: 'admin' } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
