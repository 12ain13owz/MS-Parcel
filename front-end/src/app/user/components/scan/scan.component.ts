import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from '../../shared/http.service';
import { NotifyService } from '../../shared/notify.service';
import { SearchProductModel } from '../../shared/product.model';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
  @ViewChild('inputSearch') inputSearch: ElementRef;
  dataSource = new MatTableDataSource<SearchProductModel>();
  displayedColumns: string[] = ['code', 'title', 'stock', 'quantity', 'action'];
  dataQuantity: SearchProductModel[] = [];

  formSearch: FormGroup;
  spinLoading: boolean = false;
  isDisabled: boolean = false;
  isDisabledBtnStock: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notify: NotifyService,
    private http: HttpService
  ) {
    this.createFormSearch();
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.inputSearch.nativeElement.focus();
  }

  onSearchProduct() {
    if (!this.code.value) return;
    let code: string = this.code.value;
    code = code.replace(/^\s+|\s+$/gm, '');

    const index = this.dataSource.data.findIndex((data) => data.code == code);

    if (index >= 0) {
      this.dataSource.data[index].quantity += 1;
      this.code.setValue('');
    } else {
      this.spinLoading = true;
      this.isDisabled = true;
      this.http
        .getProductByCode(code)
        .subscribe({
          next: (data: SearchProductModel) => {
            this.code.setValue('');
            const dataTable = this.dataSource.data;
            dataTable.push(data);

            this.dataSource = new MatTableDataSource<SearchProductModel>(
              dataTable
            );
          },
          error: (err) => {
            if (err.status === 500) {
              this.notify.showNotify('error', 'Error (500) Bad Request!');
            } else this.notify.showNotify('error', err.error.message);
          },
        })
        .add(() => {
          this.spinLoading = false;
          this.isDisabled = false;
        });
    }
  }

  onCutProductStock() {
    if (this.dataSource.data.length == 0) return;

    this.isDisabledBtnStock = true;
    this.http
      .cutProductStock(this.dataSource.data)
      .subscribe({
        next: (data) => {
          let count = data.length;
          this.dataSource = new MatTableDataSource<SearchProductModel>(data);
          this.notify.showNotify('info', `Inventory update. Failed ${count}.`);
        },
        error: (err) => {
          if (err.status === 500) {
            this.notify.showNotify('error', 'Error (500) Bad Request!');
          } else this.notify.showNotify('error', err.error.message);
        },
      })
      .add(() => {
        this.isDisabledBtnStock = false;
      });
  }

  onRemoveProductStock(code: string) {
    if (!code) return;

    const index = this.dataSource.data.findIndex((data) => data.code == code);

    if (index >= 0) {
      const data = this.dataSource.data.filter((data) => {
        return data.code != code;
      });
      this.dataSource.data = data;
    }
  }

  createFormSearch() {
    this.formSearch = this.fb.group({
      code: [''],
    });
  }

  clearInputSearch() {
    this.code.setValue('');
    this.inputSearch.nativeElement.focus();
  }

  Add(el: SearchProductModel) {
    const index = this.dataSource.data.findIndex(
      (data) => data.code == el.code
    );
    if (index >= 0) {
      const stock = this.dataSource.data[index].stock;
      if (stock <= el.quantity) el.quantity = stock;
      else {
        this.dataSource.data[index].quantity += 1;
      }
    }
  }

  Remove(el: SearchProductModel) {
    if (el.quantity <= 1) {
      el.quantity = 1;
      return;
    }

    const index = this.dataSource.data.findIndex(
      (data) => data.code == el.code
    );
    if (index >= 0) {
      this.dataSource.data[index].quantity -= 1;
    }
  }

  InputQuantity(el: SearchProductModel, event: Event) {
    let e = event.target as HTMLInputElement;
    let quantity = e.value;

    if (quantity) {
      quantity = this.NumberOnly(quantity);
    } else {
      quantity = '1';
    }

    const index = this.dataSource.data.findIndex(
      (data) => data.code == el.code
    );

    if (index >= 0) {
      const stock = this.dataSource.data[index].stock;
      if (stock <= Number(quantity)) quantity = stock.toString();

      this.dataSource.data[index].quantity = Number(quantity);
      e.value = quantity;
    }
  }

  NumberOnly(number: string) {
    number = number.replace(/[^0-9]/g, '');
    number = number.replace(/^(?!00[^0])0/, '');
    number = number == '' ? '1' : number;
    return number;
  }

  get code() {
    return this.formSearch.controls['code'];
  }
}
