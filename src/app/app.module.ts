import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Step1Component } from './_components/step1/step1.component';
import { Step2Component } from './_components/step2/step2.component';
import { Step3Component } from './_components/step3/step3.component';
import { Step4Component } from './_components/step4/step4.component';
import { Step5Component } from './_components/step5/step5.component';
import { SubmitComponent } from './_components/submit/submit.component';
import { ModalComponent } from './_components/modal/modal.component';
import { HomeComponent } from './_components/home/home.component';
import { IntroductionComponent } from './_components/introduction/introduction.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FooterComponent } from './_components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    SubmitComponent,
    ModalComponent,
    HomeComponent,
    IntroductionComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }