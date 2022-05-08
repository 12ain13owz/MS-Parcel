import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from '../../shared/http.service';
import { NotifyService } from '../../shared/notify.service';
import {
  EditProductModel,
  TableProductModel,
} from '../../shared/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selection = new SelectionModel<TableProductModel>(true, []);
  dataSource = new MatTableDataSource<TableProductModel>();
  displayedColumns: string[] = [
    'select',
    'code',
    'stock',
    'title',
    'edit',
    'delete',
  ];
  spinLoading: boolean = false;
  isDisabledBTNBarcode: boolean = false;

  constructor(
    private http: HttpService,
    public notify: NotifyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(): void {
    this.spinLoading = true;
    this.http
      .getAllProduct()
      .subscribe({
        next: (data: TableProductModel[]) => {
          this.dataSource = new MatTableDataSource<TableProductModel>(data);
          this.dataSource.paginator = this.paginator;
        },
        error: (err) => {
          if (err.status === 500) {
            this.notify.showNotify('error', 'Error (500) Bad Request!');
          } else this.notify.showNotify('error', err.error.message);
        },
      })
      .add(() => {
        this.spinLoading = false;
      });
  }

  onDeleteProduct(id: number, code: string): void {
    this.notify.onAlertComfirm().then((result) => {
      if (result.isConfirmed) {
        this.spinLoading = true;
        this.http
          .deleteProduct(id)
          .subscribe({
            next: (data) => {
              this.notify.showAlert(
                `Deleted! ${code}`,
                'Your file has been deleted.'
              );
              this.getAllProduct();
            },
            error: (err) => {
              if (err.status === 500) {
                this.notify.showNotify('error', 'Error (500) Bad Request!');
              } else this.notify.showNotify('error', err.error.message);
            },
          })
          .add(() => {
            this.spinLoading = false;
          });
      }
    });
  }

  generateBarcode() {
    const data = this.selection.selected;
    if (data.length <= 0) return;

    this.isDisabledBTNBarcode = true;
    this.http
      .generateBarcode(data)
      .subscribe({
        next: (data) => {
          this.downloadPDF(data.b64Data, data.filename);
        },
        error: (err) => {
          if (err.status === 500) {
            this.notify.showNotify('error', 'Error (500) Bad Request!');
          } else this.notify.showNotify('error', err.error.message);
        },
      })
      .add(() => {
        this.isDisabledBTNBarcode = false;
      });
  }

  downloadPDF(pdf: string, filename: string) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement('a');

    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
    downloadLink.remove();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: TableProductModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  openDialog(form: AbstractControl) {
    const dialogRef = this.dialog.open(EditProductDialog, {
      height: 'auto',
      width: '600px',
      data: form,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.dataSource.data.findIndex(
          (data) => data.id == result.id
        );

        if (index >= 0) {
          this.dataSource.data[index].stock = result.stock + result.addStock;
          this.dataSource.data[index].title = result.title;
          this.dataSource.data[index].specification = result.specification;
        }
      }
    });
  }
}

@Component({
  selector: 'app-edit-product',
  templateUrl: 'edit-product.component.html',
})
export class EditProductDialog {
  @ViewChild('inputTitle') inputTitle: ElementRef;
  form: FormGroup;
  isDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notify: NotifyService,
    private http: HttpService,
    private dialogRef: MatDialogRef<EditProductDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: EditProductModel
  ) {
    this.createFormEditProduct();
  }

  ngAfterViewInit(): void {
    this.dialog.afterOpened
      .subscribe(() => {
        this.inputTitle.nativeElement.focus();
      })
      .unsubscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isDisabled = true;
    const form = {
      id: this.id.value,
      code: this.code.value,
      title: this.title.value,
      stock: Number(this.stock.value),
      addStock: Number(this.addStock.value),
      specification: this.specification.value,
    };

    this.http
      .editProduct(form)
      .subscribe({
        next: (data) => {
          this.dialogRef.close(form);
          this.notify.showNotify('success', data.message);
        },
        error: (err) => {
          if (err.status === 500) {
            this.notify.showNotify('error', 'Error (500) Bad Request!');
          } else this.notify.showNotify('error', err.error.message);
        },
      })
      .add(() => {
        this.isDisabled = false;
      });
  }

  onReset(): void {
    this.createFormEditProduct();
    this.inputTitle.nativeElement.focus();
  }

  createFormEditProduct() {
    this.form = this.fb.group({
      id: [this.data.id],
      code: [{ value: this.data.code, disabled: true }, [Validators.required]],
      title: [this.data.title],
      stock: [
        { value: this.data.stock, disabled: true },
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      addStock: ['0', [Validators.required, Validators.pattern('^[0-9]*$')]],
      specification: [this.data.specification],
    });
  }

  NumberOnly(number: string, value: AbstractControl) {
    number = number.replace(/[^0-9]/g, '');
    number = number.replace(/^(?!00[^0])0/, '');
    number = number == '' ? '0' : number;
    value.setValue(number);
  }

  get id() {
    return this.form.controls['id'];
  }

  get code() {
    return this.form.controls['code'];
  }

  get title() {
    return this.form.controls['title'];
  }

  get stock() {
    return this.form.controls['stock'];
  }

  get addStock() {
    return this.form.controls['addStock'];
  }

  get specification() {
    return this.form.controls['specification'];
  }
}
