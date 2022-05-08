import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from '../../shared/http.service';
import { NotifyService } from '../../shared/notify.service';
import { TokenService } from '../../shared/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private token: TokenService,
    public dialog: MatDialog
  ) {}

  @Output() sidenavToggle = new EventEmitter();

  subscribe: Subscription;
  title: any = '';
  email: string = '';

  ngOnInit(): void {
    this.email = this.token.getUser().email;
    this.title = this.getPath;
    this.subscribe = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) this.title = this.getPath;
      if (!isNaN(Number(this.title))) this.title = this.getPathOnId[0];
    });
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  onLogout() {
    this.token.onLogout();
    this.router.navigate(['login']);
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  get getPath() {
    return this.router.url.split('/').pop();
  }

  get getPathOnId() {
    return this.router.url.split('/').slice(-2);
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewProductDialog, {
      height: 'auto',
      width: '600px',
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}

@Component({
  selector: 'app-new-product',
  templateUrl: 'new-product.component.html',
})
export class NewProductDialog {
  @ViewChild('inputCode') inputCode: ElementRef;
  form: FormGroup;
  isDisabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notify: NotifyService,
    private http: HttpService,
    public dialog: MatDialog
  ) {
    this.createFormNewProduct();
  }

  ngAfterViewInit(): void {
    this.dialog.afterOpened
      .subscribe(() => {
        this.inputCode.nativeElement.focus();
      })
      .unsubscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.notify.loading = true;
    this.isDisabled = true;
    this.http
      .newProduct(this.form.value)
      .subscribe({
        next: (data) => {
          this.notify.showNotify('success', 'New Product successfully');
          this.onReset();
        },
        error: (err) => {
          if (err.status === 500) {
            this.notify.showNotify('error', 'Error (500) Bad Request!');
          } else this.notify.showNotify('error', err.error.message);
        },
      })
      .add(() => {
        this.notify.loading = false;
        this.isDisabled = false;
      });
  }

  onReset(): void {
    this.form.reset();
    this.stock.setValue('0');
    this.inputCode.nativeElement.focus();
  }

  createFormNewProduct() {
    this.form = this.fb.group({
      code: ['', [Validators.required]],
      title: [''],
      stock: ['0', [Validators.required, Validators.pattern('^[0-9]*$')]],
      specification: [''],
    });
  }

  NumberOnly(number: string, value: AbstractControl) {
    number = number.replace(/[^0-9]/g, '');
    number = number.replace(/^(?!00[^0])0/, '');
    number = number == '' ? '0' : number;
    value.setValue(number);
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

  get specification() {
    return this.form.controls['specification'];
  }
}
