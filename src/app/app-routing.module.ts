import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { IntroductionComponent } from './_components/introduction/introduction.component';
import { Step1Component } from './_components/step1/step1.component';
import { Step2Component } from './_components/step2/step2.component';
import { Step3Component } from './_components/step3/step3.component';
import { Step4Component } from './_components/step4/step4.component';
import { SubmitComponent } from './_components/submit/submit.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'introduction', component: IntroductionComponent },
  { path: 'step-1', component: Step1Component },
  { path: 'step-2', component: Step2Component },
  { path: 'step-3', component: Step3Component },
  { path: 'step-4', component: Step4Component },
  { path: 'submit', component: SubmitComponent },
  //{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  //{ path: 'detail/:bookID', component: DetailComponent },
  //{ path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { expectedRole: 'admin' } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
