import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-que',
  templateUrl: './que.component.html',
  styleUrls: ['./que.component.scss'],
})
export class QueComponent implements OnInit {
  responseData: any;
  queGoc: any = {}; // Doi tuong luu que Goc
  queBien: any = {}; // Doi tuong luu que Bien
  cloneQueGoc: any = {}; // Doi tuong clone que Goc
  duongLich: any = {}; // Doi tuong luu ngay thang nam Duong Lich
  amLich: any = {}; // Doi tuong luu ngay thang nam Am Lich
  timeLapQue: any = {}; // Doi tuong luu gio lap que
  vuongKhac: any = {}; // Doi tuong luu vuongkhac
  lucThu: any = {}; // Doi tuong luu Luc Thu

  @ViewChildren('tuoiNguHanhElement')
  tuoiNguHanhElements!: QueryList<ElementRef>; // Get td chua Ngu Hanh
  @ViewChildren('LucThanElement') lucThanElements!: QueryList<ElementRef>; // Get td chua Luc Than
  @ViewChildren('thanHaoElement') thanHaoElements!: QueryList<ElementRef>; // Get td chua Than Hao

  constructor(private router: Router) {
    // Get data from state (from HomeComponent after submit form)
    this.responseData =
      this.router.getCurrentNavigation()?.extras.state?.['data'];
  }

  // Khi mới khởi động
  ngOnInit(): void {
    console.log('Received Data:', this.responseData);

    if (this.responseData) {
      this.queGoc = this.responseData.QueGoc || {};
      this.queBien = this.responseData.QueBien || this.responseData.QueGoc;
      this.duongLich = this.responseData.DuongLich || {};
      this.amLich = this.responseData.AmLich || {};
      this.timeLapQue = this.responseData.GioLapQue || {};
    }

    // clone queGoc tu API- phai them this. vi cloneQueGoc la member of class
    this.cloneQueGoc = _.cloneDeep(this.queGoc);
    // Them truong Thần vào clone Quẻ Gốc để xử lý Dụng Thần, Cừu Thần,...
    this.cloneQueGoc.thanHao1 = '';
    this.cloneQueGoc.thanHao2 = '';
    this.cloneQueGoc.thanHao3 = '';
    this.cloneQueGoc.thanHao4 = '';
    this.cloneQueGoc.thanHao5 = '';
    this.cloneQueGoc.thanHao6 = '';

    // Them trường Lục Thú vào clone Quẻ Gốc để xử lý
    this.cloneQueGoc.lucThu1 = '';
    this.cloneQueGoc.lucThu2 = '';
    this.cloneQueGoc.lucThu3 = '';
    this.cloneQueGoc.lucThu4 = '';
    this.cloneQueGoc.lucThu5 = '';
    this.cloneQueGoc.lucThu6 = '';

    // console.log('que Goc Clone: '+ JSON.stringify(this.cloneQueGoc));

    // Convert Can Chi
    const CAN = [
      'Giáp',
      'Ất',
      'Bính',
      'Đinh',
      'Mậu',
      'Kỷ',
      'Canh',
      'Tân',
      'Nhâm',
      'Quý',
    ];
    const CHI = [
      'Tý',
      'Sửu',
      'Dần',
      'Mão',
      'Thìn',
      'Tỵ',
      'Ngọ',
      'Mùi',
      'Thân',
      'Dậu',
      'Tuất',
      'Hợi',
    ];

    // Tính Can Chi cho năm - write to amLich object
    const yearAmLichCan = CAN[(this.amLich.lunarYear + 6) % 10];
    const yearAmLichChi = CHI[(this.amLich.lunarYear + 8) % 12];
    this.amLich.yearAmLichCan = yearAmLichCan;
    this.amLich.yearAmLichChi = yearAmLichChi;

    // Tính Can Chi cho tháng
    const Y = (this.amLich.lunarMonth + 1) % 12;
    const X = (this.amLich.lunarYear * 12 + this.amLich.lunarMonth + 3) % 10;

    this.amLich.monthAmLichCan = CAN[X];
    this.amLich.monthAmLichChi = CHI[Y];

    // Tính Can Chi cho ngày (input là ngày Dương lịch -> Can Chi ngày âm lịch)
    const y = this.duongLich.solarYear;
    const m = this.duongLich.solarMonth;
    const d = this.duongLich.solarDay;
    const Z = this.INT(this.UniversalToJD(d, m, y) + 9.5) % 10;
    const T = this.INT(this.UniversalToJD(d, m, y) + 1.5) % 12;

    this.amLich.dayAmLichCan = CAN[Z];
    this.amLich.dayAmLichChi = CHI[T];

    // Check Luc Thu
    this.checkLucThu();
  }

  INT(d: number): number {
    return Math.floor(d);
  }

  UniversalToJD(D: number, M: number, Y: number): number {
    let JD: number;
    if (
      Y > 1582 ||
      (Y === 1582 && M > 10) ||
      (Y === 1582 && M === 10 && D > 14)
    ) {
      JD =
        367 * Y -
        Math.floor((7 * (Y + Math.floor((M + 9) / 12))) / 4) -
        Math.floor((3 * (Math.floor((Y + (M - 9) / 7) / 100) + 1)) / 4) +
        Math.floor((275 * M) / 9) +
        D +
        1721028.5;
    } else {
      JD =
        367 * Y -
        Math.floor((7 * (Y + 5001 + Math.floor((M - 9) / 7))) / 4) +
        Math.floor((275 * M) / 9) +
        D +
        1729776.5;
    }
    return JD;
  }

  checkRelationship(selectedNguHanh: string): void {
    const sinhRelations: { [key: string]: string } = {
      Kim: 'Thủy',
      Thủy: 'Mộc',
      Mộc: 'Hỏa',
      Hỏa: 'Thổ',
      Thổ: 'Kim',
    };

    const khacRelations: { [key: string]: string } = {
      Kim: 'Mộc',
      Mộc: 'Thổ',
      Thổ: 'Thủy',
      Thủy: 'Hỏa',
      Hỏa: 'Kim',
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
        element.nativeElement.style.backgroundColor = '';
      }
    });
  }

  //Duoc Sinh-Khac Relation
  dcSinhRelations: { [key: string]: string } = {
    Kim: 'Thổ',
    Thủy: 'Kim',
    Mộc: 'Thủy',
    Hỏa: 'Mộc',
    Thổ: 'Hỏa',
  };

  biKhacRelations: { [key: string]: string } = {
    Kim: 'Hỏa',
    Mộc: 'Kim',
    Thổ: 'Mộc',
    Thủy: 'Thổ',
    Hỏa: 'Thủy',
  };

  khacRelations: { [key: string]: string } = {
    Kim: 'Mộc',
    Mộc: 'Thổ',
    Thổ: 'Thủy',
    Thủy: 'Hỏa',
    Hỏa: 'Kim',
  };

  sinhRelations: { [key: string]: string } = {
    Kim: 'Thủy',
    Thủy: 'Mộc',
    Mộc: 'Hỏa',
    Hỏa: 'Thổ',
    Thổ: 'Kim',
  };

  tuoiHopPairs = [
    ['NGỌ', 'MÙI'],
    ['TỴ', 'THÂN'],
    ['THÌN', 'DẬU'],
    ['MÃO', 'TUẤT'],
    ['DẦN', 'HỢI'],
    ['SỬU', 'TÍ'],
  ];

  tuoiKhacPairs = [
    ['NGỌ', 'TÍ'],
    ['SỬU', 'MÙI'],
    ['DẦN', 'THÂN'],
    ['MÃO', 'DẬU'],
    ['THÌN', 'TUẤT'],
    ['TỴ', 'HỢI'],
  ];

  checkHopTuoi(tuoi1: string, tuoi2: string): boolean {
    return this.tuoiHopPairs.some(
      (pair) =>
        (pair[0].toUpperCase() === tuoi1.toUpperCase() &&
          pair[1].toUpperCase() === tuoi2.toUpperCase()) ||
        (pair[0].toUpperCase() === tuoi2 &&
          pair[1].toUpperCase() === tuoi1.toUpperCase())
    );
  }

  checkKhacTuoi(tuoi1: string, tuoi2: string): boolean {
    return this.tuoiKhacPairs.some(
      (pair) =>
        (pair[0].toUpperCase() === tuoi1.toUpperCase() &&
          pair[1].toUpperCase() === tuoi2.toUpperCase()) ||
        (pair[0].toUpperCase() === tuoi2 &&
          pair[1].toUpperCase() === tuoi1.toUpperCase())
    );
  }

  // Check Luc Than Relationship
  checkLucThanRelationship(selectedLucThan: any): void {
    const sinhRelations: { [key: string]: string } = {
      'Phụ Mẫu': 'Huynh Đệ',
      'Huynh Đệ': 'Tử Tôn',
      'Tử Tôn': 'Thê Tài',
      'Thê Tài': 'Quan Quỷ',
      'Quan Quỷ': 'Phụ Mẫu',
    };

    const khacRelations: { [key: string]: string } = {
      'Phụ Mẫu': 'Tử Tôn',
      'Tử Tôn': 'Quan Quỷ',
      'Quan Quỷ': 'Huynh Đệ',
      'Huynh Đệ': 'Thê Tài',
      'Thê Tài': 'Phụ Mẫu',
    };

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
        element.nativeElement.style.backgroundColor = '';
      }
    });
  }

  checkLucThanRelationshipPhucThan(
    phucthanHao: any,
    selectedHao: number
  ): void {
    const lucThanPhucThan = phucthanHao.split('-')[0].trim();

    const sinhRelations: { [key: string]: string } = {
      'Phụ Mẫu': 'Huynh Đệ',
      'Huynh Đệ': 'Tử Tôn',
      'Tử Tôn': 'Thê Tài',
      'Thê Tài': 'Quan Quỷ',
      'Quan Quỷ': 'Phụ Mẫu',
    };

    const khacRelations: { [key: string]: string } = {
      'Phụ Mẫu': 'Tử Tôn',
      'Tử Tôn': 'Quan Quỷ',
      'Quan Quỷ': 'Huynh Đệ',
      'Huynh Đệ': 'Thê Tài',
      'Thê Tài': 'Phụ Mẫu',
    };

    // Set css
    this.lucThanElements.forEach((element: any) => {
      const lucThan = element.nativeElement.getAttribute('data-lucThan');

      if (sinhRelations[lucThanPhucThan] === lucThan) {
        element.nativeElement.style.backgroundColor = 'green';
        element.nativeElement.style.color = 'white';
      } else if (khacRelations[lucThanPhucThan] === lucThan) {
        element.nativeElement.style.backgroundColor = 'red';
        element.nativeElement.style.color = 'white';
      } else {
        element.nativeElement.style.backgroundColor = '';
      }
    });

    // Gan Phuc Than vao o Phuc Than , gan gia tri nguyen than, cuu than, ky than cho cac hao con lai
    // reset Than cua cac Hao
    this.cloneQueGoc.thanHao1 = '';
    this.cloneQueGoc.thanHao2 = '';
    this.cloneQueGoc.thanHao3 = '';
    this.cloneQueGoc.thanHao4 = '';
    this.cloneQueGoc.thanHao5 = '';
    this.cloneQueGoc.thanHao6 = '';
    this.cloneQueGoc.phucThanHao1 = '';
    this.cloneQueGoc.phucThanHao2 = '';
    this.cloneQueGoc.phucThanHao3 = '';
    this.cloneQueGoc.phucThanHao4 = '';
    this.cloneQueGoc.phucThanHao5 = '';
    this.cloneQueGoc.phucThanHao6 = '';

    // Đặt hào được chọn là "Dụng Thần"
    this.cloneQueGoc['phucThanHao' + selectedHao] = 'Dụng Thần';

    // Lục Thân của phục thân hào được chọn, ví dụ: phục thân = "Thê Tài - Ngọ Hỏa" -> chỉ lấy "Thê Tài"
    this.cloneQueGoc.lucThan.phuc = Array.from(
      { length: 6 },
      (_, i) => this.queGoc.lucThan[`phuc${i + 1}`] || ''
    );

    const selectedLucThan = this.cloneQueGoc.lucThan.phuc[selectedHao - 1]
      .split('-')[0]
      .trim();

    // Xác định các mối quan hệ sinh/khắc của Lục Thân của hào được chọn
    const sinhLucThan = this.lucThanDuocSinhRelations[selectedLucThan]; // Lục Thân Sinh
    const khacLucThan = this.lucThanKhacRelations[selectedLucThan]; // Lục Thân Khắc
    const biKhacLucThan = this.lucThanBiKhacRelations[selectedLucThan]; // Lục Thân Bị Khắc

    for (let i = 1; i <= 6; i++) {
      if (i === selectedHao) continue; // Bỏ qua hào đã được chọn

      const currentLucThan = this.queGoc.lucThan['hao' + i]; // Lục Thân của hào hiện tại

      if (sinhLucThan === currentLucThan) {
        // Xác định Nguyên Thần (Dụng Thần ĐƯỢC SINH bởi)
        this.cloneQueGoc['thanHao' + i] =
          this.thanDuocSinhRelations['Dụng Thần'];
      } else if (khacLucThan === currentLucThan) {
        // Xác định Cừu Thần (bị Dụng Thần khắc)
        this.cloneQueGoc['thanHao' + i] = this.thanKhacRelations['Dụng Thần'];
      } else if (biKhacLucThan === currentLucThan) {
        // Xác định Kỵ Thần (khắc Dụng Thần)
        this.cloneQueGoc['thanHao' + i] = this.thanBiKhacRelations['Dụng Thần'];
      }
    }
  }

  // Check Phản Ngâm Tượng Quẻ theo Cung
  phanNgamPairs = [
    ['CÀN', 'TỐN'],
    ['KHẢM', 'LY'],
    ['CẤN', 'KHÔN'],
    ['ĐOÀI', 'CHẤN'],
  ];

  checkPhanNgam(cung1: string, cung2: string): boolean {
    return this.phanNgamPairs.some(
      (pair) =>
        (pair[0] === cung1 && pair[1] === cung2) ||
        (pair[0] === cung2 && pair[1] === cung1)
    );
  }

  // Check Phản Ngâm Hào theo quẻ tuổi
  phanNgamHaoPairs = [
    ['Ngọ', 'Mùi'],
    ['Tị', 'Thân'],
    ['Thìn', 'Dậu'],
    ['Mão', 'Tuất'],
    ['Dần', 'Hợi'],
    ['Sửu', 'Tí'],
  ];

  checkPhanNgamHao(tuoi1: string, tuoi2: string): boolean {
    return this.phanNgamHaoPairs.some(
      (pair) =>
        (pair[0] === tuoi1 && pair[1] === tuoi2) ||
        (pair[0] === tuoi2 && pair[1] === tuoi1)
    );
  }

  // Hàm chọn Dụng thần, Nguyên Thần, Kỵ Thần, Cừu Thần

  lucThanDuocSinhRelations: { [key: string]: string } = {
    'Quan Quỷ': 'Thê Tài',
    'Phụ Mẫu': 'Quan Quỷ',
    'Huynh Đệ': 'Phụ Mẫu',
    'Tử Tôn': 'Huynh Đệ',
    'Thê Tài': 'Tử Tôn',
  };

  lucThanKhacRelations: { [key: string]: string } = {
    'Phụ Mẫu': 'Tử Tôn',
    'Tử Tôn': 'Quan Quỷ',
    'Quan Quỷ': 'Huynh Đệ',
    'Huynh Đệ': 'Thê Tài',
    'Thê Tài': 'Phụ Mẫu',
  };

  lucThanBiKhacRelations: { [key: string]: string } = {
    'Phụ Mẫu': 'Thê Tài',
    'Tử Tôn': 'Phụ Mẫu',
    'Quan Quỷ': 'Tử Tôn',
    'Huynh Đệ': 'Quan Quỷ',
    'Thê Tài': 'Huynh Đệ',
  };

  thanSinhRelations: { [key: string]: string } = {
    'Nguyên Thần': 'Dụng Thần',
    'Kỵ Thần': 'Nguyên Thần',
    'Cừu Thần': 'Kỵ Thần',
  };

  thanDuocSinhRelations: { [key: string]: string } = {
    'Nguyên Thần': 'Kỵ Thần',
    'Kỵ Thần': 'Cừu Thần',
    'Dụng Thần': 'Nguyên Thần',
  };

  thanKhacRelations: { [key: string]: string } = {
    'Kỵ Thần': 'Dụng Thần',
    'Dụng Thần': 'Cừu Thần',
    'Cừu Thần': 'Nguyên Thần',
  };

  thanBiKhacRelations: { [key: string]: string } = {
    'Dụng Thần': 'Kỵ Thần',
    'Cừu Thần': 'Dụng Thần',
    'Nguyên Thần': 'Cừu Thần',
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
    this.cloneQueGoc.thanHao1 = '';
    this.cloneQueGoc.thanHao2 = '';
    this.cloneQueGoc.thanHao3 = '';
    this.cloneQueGoc.thanHao4 = '';
    this.cloneQueGoc.thanHao5 = '';
    this.cloneQueGoc.thanHao6 = '';
    this.cloneQueGoc.phucThanHao1 = '';
    this.cloneQueGoc.phucThanHao2 = '';
    this.cloneQueGoc.phucThanHao3 = '';
    this.cloneQueGoc.phucThanHao4 = '';
    this.cloneQueGoc.phucThanHao5 = '';
    this.cloneQueGoc.phucThanHao6 = '';

    // Đặt hào được chọn là "Dụng Thần"
    this.cloneQueGoc['thanHao' + selectedHao] = 'Dụng Thần';

    // Lục Thân của hào được chọn
    const selectedLucThan = this.queGoc.lucThan['hao' + selectedHao];

    // Xác định các mối quan hệ sinh/khắc của Lục Thân của hào được chọn
    const sinhLucThan = this.lucThanDuocSinhRelations[selectedLucThan]; // Lục Thân Sinh
    const khacLucThan = this.lucThanKhacRelations[selectedLucThan]; // Lục Thân Khắc
    const biKhacLucThan = this.lucThanBiKhacRelations[selectedLucThan]; // Lục Thân Bị Khắc

    for (let i = 1; i <= 6; i++) {
      if (i === selectedHao) continue; // Bỏ qua hào đã được chọn

      const currentLucThan = this.queGoc.lucThan['hao' + i]; // Lục Thân của hào hiện tại

      if (sinhLucThan === currentLucThan) {
        // Xác định Nguyên Thần (Dụng Thần ĐƯỢC SINH bởi)
        this.cloneQueGoc['thanHao' + i] =
          this.thanDuocSinhRelations['Dụng Thần'];
      } else if (khacLucThan === currentLucThan) {
        // Xác định Cừu Thần (bị Dụng Thần khắc)
        this.cloneQueGoc['thanHao' + i] = this.thanKhacRelations['Dụng Thần'];
      } else if (biKhacLucThan === currentLucThan) {
        // Xác định Kỵ Thần (khắc Dụng Thần)
        this.cloneQueGoc['thanHao' + i] = this.thanBiKhacRelations['Dụng Thần'];
      } else if (currentLucThan === selectedLucThan) {
        this.cloneQueGoc['thanHao' + i] = 'Dụng Thần';
      }
    }
  }

  // reset Ngu Hanh color
  resetBGColor(): void {
    this.tuoiNguHanhElements.forEach((element) => {
      element.nativeElement.style.backgroundColor = '';
      element.nativeElement.style.color = '';
    });
  }

  // reset Luc Than color
  resetBGColorLucThan(): void {
    this.lucThanElements.forEach((element) => {
      element.nativeElement.style.backgroundColor = '';
      element.nativeElement.style.color = '';
    });
  }

  // Hien thi Ngu Hanh cua Nhat Nguyet
  getNguHanhDayMonth(chi: string): string {
    switch (chi) {
      case 'Dần':
      case 'Mão':
        return 'Mộc';
      case 'Sửu':
      case 'Tuất':
      case 'Mùi':
      case 'Thìn':
        return 'Thổ';
      case 'Tý':
      case 'Hợi':
        return 'Thủy';
      case 'Dậu':
      case 'Thân':
        return 'Kim';
      case 'Ngọ':
      case 'Tỵ':
        return 'Hỏa';
      default:
        return '';
    }
  }

  // Check Nhật/ Nguyệt tương sinh - khắc (Nhật - Ngày) (Nguyệt-Tháng)
  checkVuongKhac(tuoiHao: any): string {
    const nhat = this.getNguHanhDayMonth(this.amLich.dayAmLichChi);
    const nguyet = this.getNguHanhDayMonth(this.amLich.monthAmLichChi);

    let nhatEffect = '';
    let nguyetEffect = '';

    // Kiểm tra Nhật ảnh hưởng
    if (this.amLich.dayAmLichChi === tuoiHao.name) {
      nhatEffect = 'Nhật Thần';
    } else if (nhat === tuoiHao.nguHanh.nguHanhName) {
      nhatEffect = 'Nhật Vượng';
    } else if (nhat == this.dcSinhRelations[tuoiHao.nguHanh.nguHanhName]) {
      nhatEffect = 'Nhật Sinh';
    } else if (nhat == this.biKhacRelations[tuoiHao.nguHanh.nguHanhName]) {
      nhatEffect = 'Nhật Khắc';
    } else if (this.checkHopTuoi(this.amLich.dayAmLichChi, tuoiHao.name)) {
      nhatEffect = 'Nhật Hợp';
    }

    // Kiểm tra Nguyệt ảnh hưởng
    if (this.amLich.monthAmLichChi === tuoiHao.name) {
      nguyetEffect = 'Nguyệt Kiến';
    } else if (nguyet === tuoiHao.nguHanh.nguHanhName) {
      nguyetEffect = 'Nguyệt Vượng';
    } else if (nguyet === this.dcSinhRelations[tuoiHao.nguHanh.nguHanhName]) {
      nguyetEffect = 'Nguyệt Sinh';
    } else if (nguyet === this.biKhacRelations[tuoiHao.nguHanh.nguHanhName]) {
      nguyetEffect = 'Nguyệt Khắc';
    } else if (this.checkHopTuoi(this.amLich.monthAmLichChi, tuoiHao.name)) {
      nguyetEffect = 'Nguyệt Hợp';
    }
    return `${nhatEffect}  ${nguyetEffect}`;
  }

  // Check Tu Thoi Vuong Tuong
  checkTuThoiVuongTuong(nguHanh: string): string {
    const nguyet = this.getNguHanhDayMonth(
      this.amLich.monthAmLichChi
    ).toUpperCase(); // Tứ Thời Vượng Tướng chỉ xét tác động của Nguyệt lên mỗi Hào

    if (nguyet === this.dcSinhRelations[nguHanh].toUpperCase()) return 'Tướng';
    else if (nguyet === this.khacRelations[nguHanh].toUpperCase()) return 'Tù';
    else if (nguyet === nguHanh.toUpperCase()) return 'Vượng';
    else if (nguyet === this.sinhRelations[nguHanh].toUpperCase()) return 'Hưu';
    else if (nguyet === this.biKhacRelations[nguHanh].toUpperCase())
      return 'Tử';

    return '';
  }

  // Vong Truong Sinh
  checkVongTruongSinh(tuoiHaoNguHanh: string, nhatNguyetChi: string): string {
    const vongTruongSinh = [
      'Trường Sinh',
      'Mộc Dục',
      'Quan Đới',
      'Lâm Quan',
      'Đế Vượng',
      'Suy',
      'Bệnh',
      'Tử',
      'Mộ',
      'Tuyệt',
      'Thai',
      'Dưỡng',
    ];

    const chiCycle = [
      'Tý',
      'Sửu',
      'Dần',
      'Mão',
      'Thìn',
      'Tỵ',
      'Ngọ',
      'Mùi',
      'Thân',
      'Dậu',
      'Tuất',
      'Hợi',
    ];

    // Điểm bắt đầu của vòng Trường Sinh dựa trên ngũ hành
    const startChiIndex: { [key: string]: string } = {
      Mộc: 'Hợi',
      Hỏa: 'Dần',
      Kim: 'Tỵ',
      Thổ: 'Thân',
      Thủy: 'Thân',
    };

    // Lấy điểm bắt đầu theo ngũ hành
    const startChi = startChiIndex[tuoiHaoNguHanh];

    if (!startChi) {
      return '';
    }

    // Tìm vị trí bắt đầu của vòng Trường Sinh trong chuỗi chiCycle
    const startIndex = chiCycle.indexOf(startChi);
    const currentIndex = chiCycle.indexOf(nhatNguyetChi);

    // Tính toán vị trí của trạng thái Trường Sinh
    const position = (currentIndex - startIndex + 12) % 12;

    return vongTruongSinh[position];
  }

  // Check Nguyet Pha - Am Dong - Nhat Xung
  checkNguyetPhaAmDong(tuoiHao: any, nguHanh: string): string {
    const chiNhat = this.amLich.dayAmLichChi.toUpperCase();
    const chiNguyet = this.amLich.monthAmLichChi.toUpperCase();

    let nhatEffect = '';
    let nguyetEffect = '';

    // Kiểm tra Nhật ảnh hưởng
    if (this.checkKhacTuoi(chiNhat, tuoiHao.name)) nhatEffect = 'Ám động';

    if (this.checkHopTuoi(tuoiHao.name.toUpperCase(), chiNhat))
      nhatEffect = 'Nhật Hợp';

    // Kiểm tra Nguyệt Phá
    if (this.checkKhacTuoi(chiNguyet, tuoiHao.name.toUpperCase()))
      nguyetEffect = 'Nguyệt Phá';

    if (this.checkHopTuoi(tuoiHao.name.toUpperCase(), chiNguyet))
      nguyetEffect = 'Nguyệt Hợp';

    return `${nhatEffect}  ${nguyetEffect}`;
  }

  // Export Lục Thân quẻ biến
  checkLucThanQueBien(nguHanhHaoBien: string): string {
    const nguHanhQueGoc = this.queGoc.nguHanh.nguHanhName;

    // Kiem tra Luc Than
    if (
      nguHanhHaoBien.toUpperCase() ===
      this.dcSinhRelations[nguHanhQueGoc].toUpperCase()
    )
      return 'Phụ Mẫu';
    else if (
      nguHanhHaoBien.toUpperCase() ===
      this.biKhacRelations[nguHanhQueGoc].toUpperCase()
    )
      return 'Quan Qủy';
    else if (
      nguHanhHaoBien.toUpperCase() ===
      this.khacRelations[nguHanhQueGoc].toUpperCase()
    )
      return 'Thê Tài';
    else if (
      nguHanhHaoBien.toUpperCase() ===
      this.sinhRelations[nguHanhQueGoc].toUpperCase()
    )
      return 'Tử Tôn';
    else if (nguHanhHaoBien.toUpperCase() === nguHanhQueGoc.toUpperCase())
      return 'Huynh Đệ';
    else return '';
  }

  // Check Khong Vong
  isKhongVong(name: string): boolean {
    const khongVongArray = this.checkKhongVong(name);

    return khongVongArray.includes(name.toUpperCase());
  }
  checkKhongVong(chiName: string): [resultChi1: string, resultChi2: string] {
    const can = [
      'Giáp',
      'Ất',
      'Bính',
      'Đinh',
      'Mậu',
      'Kỷ',
      'Canh',
      'Tân',
      'Nhâm',
      'Quý',
    ];
    const chi = [
      'Tý',
      'Sửu',
      'Dần',
      'Mão',
      'Thìn',
      'Tỵ',
      'Ngọ',
      'Mùi',
      'Thân',
      'Dậu',
      'Tuất',
      'Hợi',
    ];

    const nhatCan = this.amLich.dayAmLichCan; // Ví dụ: "Kỷ"
    const nhatChi = this.amLich.dayAmLichChi; // Ví dụ: "Thìn"

    // Tìm vị trí của Can và Chi trong mảng
    const startCanIndex = can.indexOf(nhatCan);
    const startChiIndex = chi.indexOf(nhatChi);

    if (startCanIndex === -1 || startChiIndex === -1) {
      return ['', '']; // Trả về rỗng nếu không tìm thấy Can hoặc Chi
    }

    // Tính khoảng cách từ Can hiện tại tới "Quý"
    const diff = can.length - 1 - startCanIndex;

    // Tính vị trí Chi sau khi cộng thêm khoảng cách
    const newChiIndex = (startChiIndex + diff) % chi.length;

    // Lấy 2 Chi tiếp theo (sau vị trí tính toán)
    const resultChi1 = chi[(newChiIndex + 1) % chi.length];
    const resultChi2 = chi[(newChiIndex + 2) % chi.length];

    return [resultChi1.toUpperCase(), resultChi2.toUpperCase()];
  }

  // Check Luc Thu
  checkLucThu(): void {
    const nhatCan = this.amLich.dayAmLichCan.toUpperCase(); // Ví dụ: "Kỷ"

    const lucThuList = [
      'Thanh Long',
      'Chu Tước',
      'Câu Trần',
      'Đằng Xà',
      'Bạch Hổ',
      'Huyền Vũ',
    ];

    // Xác định vị trí bắt đầu dựa trên nhatCan
    let startIndex = -1;

    if (['GIÁP', 'ẤT'].includes(nhatCan)) {
      startIndex = 0; //  Bắt đầu từ "Thanh Long"
    } else if (['BÍNH', 'ĐINH'].includes(nhatCan)) {
      startIndex = 1; //  Bắt đầu từ "Chu Tước"
    } else if (nhatCan === 'MẬU') {
      startIndex = 2; //  Bắt đầu từ "Câu Trần"
    } else if (nhatCan === 'KỶ') {
      startIndex = 3; // Bắt đầu từ "Đằng Xà"
    } else if (['CANH', 'TÂN'].includes(nhatCan)) {
      startIndex = 4; // Bắt đầu từ "Bạch Hổ"
    } else if (['NHÂM', 'QUÝ'].includes(nhatCan)) {
      startIndex = 5; // Bắt đầu từ "Huyền Vũ"
    }

    // Nếu không tìm được vị trí bắt đầu, không thực hiện gì
    if (startIndex === -1) return;

    // Gán các giá trị cho cloneQueGoc.lucThu1 -> cloneQueGoc.lucThu6 theo thứ tự
    for (let i = 0; i < lucThuList.length; i++) {
      const index = (startIndex + i) % lucThuList.length; // Vòng tròn danh sách
      this.cloneQueGoc[`lucThu${i + 1}`] = lucThuList[index];
    }
  }

  // Gan mau cho Luc Thu tren text
  getLucThuColor(lucThuValue: string): string {
    const lucThuColors: Record<string, string> = {
      'Thanh Long': 'green',
      'Chu Tước': '#f23309', // Light Red
      'Câu Trần': '#f2ab09',
      'Đằng Xà': '#b8860b', // Heavy Yellow
      'Bạch Hổ': 'grey',
      'Huyền Vũ': '#097ef2',
    };

    return lucThuColors[lucThuValue] || 'black'; // Màu mặc định là đen nếu không tìm thấy
  }
}
