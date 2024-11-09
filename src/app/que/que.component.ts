import { Component, ElementRef, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';


@Component({
  selector: 'app-que',
  templateUrl: './que.component.html',
  styleUrls: ['./que.component.scss']
})


export class QueComponent implements OnInit {
  responseData :any
  queGoc : any ={}  // Doi tuong luu que Goc
  queBien: any ={}  // Doi tuong luu que Bien
  cloneQueGoc: any = {} // Doi tuong clone que Goc

  @ViewChildren('tuoiNguHanhElement') tuoiNguHanhElements!: QueryList<ElementRef>;      // Get td chua Ngu Hanh
  @ViewChildren('LucThanElement') lucThanElements!: QueryList<ElementRef>;              // Get td chua Luc Than
  @ViewChildren('thanHaoElement') thanHaoElements!: QueryList<ElementRef>;              // Get td chua Than Hao

  constructor(private router: Router) {
    // Get data from state (from HomeComponent after submit form)
    this.responseData = this.router.getCurrentNavigation()?.extras.state?.['data'];
  }

  // Khi mới khởi động
  ngOnInit(): void {
    console.log('Received Data:' , this.responseData);

    if (this.responseData) {
      this.queGoc = this.responseData.QueGoc || {}
      this.queBien = this.responseData.QueBien || {}
    }
    
    // clone queGoc tu API- phai them this. vi cloneQueGoc la member of class
    this.cloneQueGoc = _.cloneDeep(this.queGoc);
      // Them truong Thần vào clone Quẻ Gốc để xử lý Dụng Thần, Cừu Thần,...
      this.cloneQueGoc.thanHao1 = ''
      this.cloneQueGoc.thanHao2 = ''
      this.cloneQueGoc.thanHao3 = ''
      this.cloneQueGoc.thanHao4 = ''
      this.cloneQueGoc.thanHao5 = ''
      this.cloneQueGoc.thanHao6 = ''
      
      console.log('que Goc Clone: '+ JSON.stringify(this.cloneQueGoc));
  }  
 
  checkRelationship(selectedNguHanh: string): void {
    const sinhRelations: {[key: string] : string} = {
      'Kim' : 'Thủy',
      'Thủy' : 'Mộc',
      'Mộc' : 'Hỏa',
      'Hỏa' : 'Thổ',
      'Thổ' : 'Kim'
    };

    const khacRelations: {[key: string] : string} = {
      'Kim' : 'Mộc',
      'Mộc' : 'Thổ',
      'Thổ' : 'Thủy',
      'Thủy' : 'Hỏa',
      'Hỏa' : 'Kim'
    };

    this.tuoiNguHanhElements.forEach((element: any) => {
      const nguHanh = element.nativeElement.getAttribute('data-nguHanh');

      if (sinhRelations[selectedNguHanh] === nguHanh) {
        element.nativeElement.style.backgroundColor = 'green';
        element.nativeElement.style.color = 'white';
      } else if (khacRelations[selectedNguHanh] === nguHanh) {
        element.nativeElement.style.backgroundColor = 'red';
        element.nativeElement.style.color = 'white';
      } else {
        element.nativeElement.style.backgroundColor = ''
      }
    })
  }

  // Check Luc Than Relationship
  checkLucThanRelationship(selectedLucThan: any) : void {
    const sinhRelations : {[key: string] : string} = {
        "Phụ Mẫu"   : "Huynh Đệ",
        "Huynh Đệ"  : "Tử Tôn",
        "Tử Tôn"    : "Thê Tài",
        "Thê Tài"   : "Quan Quỷ",
        "Quan Quỷ"  : "Phụ Mẫu"
    }

    const khacRelations : {[key: string] : string} = {
      "Phụ Mẫu" : "Tử Tôn",
      "Tử Tôn"  : "Quan Quỷ",
      "Quan Quỷ": "Huynh Đệ",
      "Huynh Đệ": "Thê Tài",
      "Thê Tài" : "Phụ Mẫu"
    }

    // Set css 
    this.lucThanElements.forEach((element: any) => {
      const lucThan = element.nativeElement.getAttribute('data-lucThan');

      if (sinhRelations[selectedLucThan] === lucThan) {
        element.nativeElement.style.backgroundColor = 'green';
        element.nativeElement.style.color = 'white';
      } else if (khacRelations[selectedLucThan] === lucThan) {
        element.nativeElement.style.backgroundColor = 'red';
        element.nativeElement.style.color = 'white';
      } else {
        element.nativeElement.style.backgroundColor = ''
      }
    })
  }

  // Check Phản Ngâm Tượng Quẻ theo Cung
  phanNgamPairs = [
      ["CÀN" , "TỐN"],
      ["KHẢM", "LY"],
      ["CẤN" , "KHÔN"],
      ["ĐOÀI", "CHẤN"]
  ]

  checkPhanNgam(cung1: string, cung2: string) : boolean {
    return this.phanNgamPairs.some(pair => 
      (pair[0] === cung1 && pair[1] === cung2) ||
      (pair[0] === cung2 && pair[1] === cung1)
    )
  }

  // Check Phản Ngâm Hào theo quẻ tuổi
  phanNgamHaoPairs = [
    ['Ngọ', 'Mùi'],
    ['Tị', 'Thân'],
    ['Thìn', 'Dậu'],
    ['Mão', 'Tuất'],
    ['Dần', 'Hợi'],
    ['Sửu', 'Tí']
  ]

  checkPhanNgamHao(tuoi1: string, tuoi2: string) : boolean {
    return this.phanNgamHaoPairs.some(pair => 
      (pair[0] === tuoi1 && pair[1] === tuoi2) ||
      (pair[0] === tuoi2 && pair[1] === tuoi1)
    )
  }
 
  // Hàm chọn Dụng thần, Nguyên Thần, Kỵ Thần, Cừu Thần

  lucThanDuocSinhRelations : {[key: string] : string} = {
    'Quan Quỷ':'Thê Tài',
    'Phụ Mẫu' :'Quan Quỷ',
    'Huynh Đệ':'Phụ Mẫu',
    'Tử Tôn':'Huynh Đệ',
    'Thê Tài': 'Tử Tôn'
  };

  lucThanKhacRelations : {[key: string] : string} = {
    'Phụ Mẫu' : 'Tử Tôn',
    'Tử Tôn' : 'Quan Quỷ',
    'Quan Quỷ' : 'Huynh Đệ',
    'Huynh Đệ' : 'Thê Tài',
    'Thê Tài' :  'Phụ Mẫu'
  };

  lucThanBiKhacRelations: {[key: string] : string} = {
    'Phụ Mẫu' : 'Thê Tài',
    'Tử Tôn' : 'Phụ Mẫu',
    'Quan Quỷ' : 'Tử Tôn',
    'Huynh Đệ' : 'Quan Quỷ',
    'Thê Tài' :  'Huynh Đệ'
  };

  thanSinhRelations : {[key: string] : string}= {
    'Nguyên Thần' : 'Dụng Thần',
    'Kỵ Thần' : 'Nguyên Thần',
    'Cừu Thần' : 'Kỵ Thần'
  };

  thanDuocSinhRelations : {[key: string] : string}= {
    'Nguyên Thần' : 'Kỵ Thần',
    'Kỵ Thần' : 'Cừu Thần',
    'Dụng Thần' : 'Nguyên Thần'
  };

  thanKhacRelations : {[key: string] : string} = {
    'Kỵ Thần' : 'Dụng Thần',
    'Dụng Thần' : 'Cừu Thần',
    'Cừu Thần' : 'Nguyên Thần'
  };

  thanBiKhacRelations : {[key: string] : string} = {
    'Dụng Thần' : 'Kỵ Thần',
    'Cừu Thần' : 'Dụng Thần',
    'Nguyên Thần': 'Cừu Thần'
  };

  // onClickHao6() : void {
  //     this.cloneQueGoc.thanHao6 = "Dụng Thần";

  //     const selectedLucThan = this.cloneQueGoc.lucThan.hao6;                // Lục Thân của Hào 6

  //     const sinhLucThan6 = this.lucThanDuocSinhRelations[selectedLucThan]       // Lục Thân Sinh của Hào 6
  //     const khacLucThan6 = this.lucThanKhacRelations[selectedLucThan]           // Lục Thân Khắc của Hào 6
  //     const biKhacLucThan6 = this.lucThanBiKhacRelations[selectedLucThan]       // Lục Thân bị Khắc của Hào 6

  //     for (let i =1; i<= 6; i++) {
              
  //         if (i == 6) continue;

  //         const currentLucThan = this.cloneQueGoc.lucThan['hao'+i];  // Lục Thân của hào trong vòng lặp

  //         if (sinhLucThan6 === currentLucThan) {
  //           this.cloneQueGoc['thanHao'+i] = this.thanDuocSinhRelations['Dụng Thần']   // xác định Nguyên Thần (Dụng Thần ĐƯỢC SINH bởi)

  //         } else if (khacLucThan6 === currentLucThan) {

  //           this.cloneQueGoc['thanHao'+i] = this.thanKhacRelations['Dụng Thần']       // Xác định Cừu Thần (bị Dụng Thần khắc)
            
  //         } else if (biKhacLucThan6 === currentLucThan) {

  //           this.cloneQueGoc['thanHao'+i] = this.thanBiKhacRelations['Dụng Thần']     // xác định Kỵ Thần (khắc Dụng Thần)
  //         }         
          
  //     }
  // }    

  onClickHao(selectedHao: number): void {
    // reset Than cua cac Hao
      this.cloneQueGoc.thanHao1 = ''
      this.cloneQueGoc.thanHao2 = ''
      this.cloneQueGoc.thanHao3 = ''
      this.cloneQueGoc.thanHao4 = ''
      this.cloneQueGoc.thanHao5 = ''
      this.cloneQueGoc.thanHao6 = ''
      
    // Đặt hào được chọn là "Dụng Thần"
    this.cloneQueGoc['thanHao' + selectedHao] = "Dụng Thần";

    // Lục Thân của hào được chọn
    const selectedLucThan = this.queGoc.lucThan['hao' + selectedHao];

    // Xác định các mối quan hệ sinh/khắc của Lục Thân của hào được chọn
    const sinhLucThan = this.lucThanDuocSinhRelations[selectedLucThan]; // Lục Thân Sinh
    const khacLucThan = this.lucThanKhacRelations[selectedLucThan];     // Lục Thân Khắc
    const biKhacLucThan = this.lucThanBiKhacRelations[selectedLucThan]; // Lục Thân Bị Khắc

    for (let i = 1; i <= 6; i++) {
        if (i === selectedHao) continue; // Bỏ qua hào đã được chọn

        const currentLucThan = this.queGoc.lucThan['hao' + i]; // Lục Thân của hào hiện tại

        if (sinhLucThan === currentLucThan) {
            // Xác định Nguyên Thần (Dụng Thần ĐƯỢC SINH bởi)
            this.cloneQueGoc['thanHao' + i] = this.thanDuocSinhRelations['Dụng Thần'];

        } else if (khacLucThan === currentLucThan) {
            // Xác định Cừu Thần (bị Dụng Thần khắc)
            this.cloneQueGoc['thanHao' + i] = this.thanKhacRelations['Dụng Thần'];

        } else if (biKhacLucThan === currentLucThan) {
            // Xác định Kỵ Thần (khắc Dụng Thần)
            this.cloneQueGoc['thanHao' + i] = this.thanBiKhacRelations['Dụng Thần'];
        }
    }
}

  // reset Ngu Hanh color
  resetBGColor():void {
    this.tuoiNguHanhElements.forEach(element => {
      element.nativeElement.style.backgroundColor = '';
      element.nativeElement.style.color = '';
    })
  }

  // reset Luc Than color
  resetBGColorLucThan():void {
    this.lucThanElements.forEach(element => {
      element.nativeElement.style.backgroundColor = '';
      element.nativeElement.style.color = '';
    })
  }
}
