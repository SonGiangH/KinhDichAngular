import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from 'src/app/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { QueComponent } from 'src/app/que/que.component';
import { QueService } from './que.service';
import { RouterModule } from '@angular/router';
import { AppComponent } from 'src/app/app/app.component';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QueComponent
  ],
  imports: [
    BrowserModule,FormsModule, HttpClientModule, AppRoutingModule, RouterModule, RouterOutlet,
    MatDatepickerModule, MatInputModule, MatNativeDateModule, BrowserAnimationsModule
  ],
  providers: [QueService],
  bootstrap: [AppComponent]
})
export class AppModule {}
