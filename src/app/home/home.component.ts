import { Component } from '@angular/core';
import { QueDTO } from 'src/dtos/que.dto';
import { QueService } from 'src/services/que.service';
import { NavigationEnd, Router } from '@angular/router';
import { now } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  // Khai bao truong du lieu trong Form
    hao_1: number;
    hao_2: number;
    hao_3: number;
    hao_4: number;
    hao_5: number;
    hao_6: number;
    dong1: number;
    dong2: number;
    dong3: number;
    dong4: number;
    dong5: number;
    dong6: number;

    selectedDate: Date;
    selectedTime: string;

    constructor(private queService: QueService, private router: Router) {
      this.hao_1 = 1; // initialize value = gia tri ban dau
      this.hao_2 = 0;
      this.hao_3 = 1;
      this.hao_4 = 1;
      this.hao_5 = 1;
      this.hao_6 = 1;
      this.dong1 = 0;
      this.dong2 = 0;
      this.dong3 = 0;
      this.dong4 = 0;
      this.dong5 = 0;
      this.dong6 = 0;

      // // initialize value = gia tri ban dau Date Time
      this.selectedDate = new Date();
      this.selectedTime = '';
    }  

  // Submit Que Fuction
  submitQue(): void {
    const queDTO : QueDTO = {
      "hao_1" : this.hao_1,
      "hao_2" : this.hao_2,
      "hao_3" : this.hao_3,
      "hao_4" : this.hao_4,
      "hao_5" : this.hao_5,
      "hao_6" : this.hao_6,
      "dong_1" : this.dong1,
      "dong_2" : this.dong2,
      "dong_3" : this.dong3,
      "dong_4" : this.dong4,
      "dong_5" : this.dong5,
      "dong_6" : this.dong6,
      "selectedDate": this.selectedDate,
      "selectedTime": this.selectedTime
    }

    console.log(queDTO);
    
    this.queService.checkQue(queDTO).subscribe({
      next: (response:any) => {       
        // Dieu huong sang Que Component
        this.router.navigate(['/que'], {state: {data:response.data}})
      },
      complete: () => {
      },
      error: (error: any) => {
        alert(`Không tìm thấy quẻ nào , error: ${error.error}`);
      },
    
    })
  }
  
}
