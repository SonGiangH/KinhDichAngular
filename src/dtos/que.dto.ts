export class QueDTO {
  hao_1: number;
  hao_2: number;
  hao_3: number;
  hao_4: number;
  hao_5: number;
  hao_6: number;
  dong_1: number;
  dong_2: number;
  dong_3: number;
  dong_4: number;
  dong_5: number;
  dong_6: number;
  selectedDate: string;
  selectedTime: string;

  constructor(data: any) {
    this.hao_1 = data.hao_1;
    this.hao_2 = data.hao_2;
    this.hao_3 = data.hao_3;
    this.hao_4 = data.hao_4;
    this.hao_5 = data.hao_5;
    this.hao_6 = data.hao_6;
    this.dong_1 = data.dong_1;
    this.dong_2 = data.dong_2;
    this.dong_3 = data.dong_3;
    this.dong_4 = data.dong_4;
    this.dong_5 = data.dong_5;
    this.dong_6 = data.dong_6;
    this.selectedDate = data.selectedDate;
    this.selectedTime = data.selectedTime;
  }
}
