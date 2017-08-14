import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { DataInputComponent } from './data-input/data-input.component';
import { DataVisualisationComponent } from './data-visualisation/data-visualisation.component';

import { reducers } from "./state-management/reducers";

@NgModule({
  declarations: [
    AppComponent,
    DataInputComponent,
    DataVisualisationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.forRoot(reducers)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
