import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from 'src/app/home/home.component';
import { QueComponent } from 'src/app/que/que.component';


// config routes
const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'que', component: QueComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}