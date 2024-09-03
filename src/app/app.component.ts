import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { HttpService } from './services/http.service'
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { debounceTime, distinctUntilChanged, Subscription, take } from 'rxjs'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { FavFruit, ITableData } from './common/interfaces'
import { SortMeta } from 'primeng/api'
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    TableModule, 
    ButtonModule, 
    PaginatorModule,
    ProgressSpinnerModule,
    DialogModule,
    CheckboxModule,
    AvatarModule,
    TagModule,
    InputTextModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  subscription!: Subscription;

  search!: FormControl;

  tableData!: ITableData[];
  
  page: number | undefined = 1;

  rows: number | undefined = 10;

  sortField: string | null = null;

  sortValue: string | null = null;

  isLoading = signal(true);

  isVisible = false;

  totalCount = 0;

  constructor(private _httpService: HttpService, private _fb: FormBuilder) {}



  ngOnInit(): void {
    this.search = this._fb.control('');
    this.getTableData();
    this.subscription = this.search.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: () => this.getTableData(),
      })
  }

  onPageChange(e: PaginatorState) {
    this.rows = e.rows;
    this.page = e.page !== undefined ? e.page + 1 : undefined;
    this.getTableData()
  }


  get isShowSpinner() {
    return this.isLoading() && !this.tableData
  }

  getFullName(row: ITableData) {
    return `${row.name?.first} ${row.name?.last}`
  }

  getFavFruit(fruit: FavFruit) {
    return fruit === FavFruit.apple ? 'success' : fruit === FavFruit.banana ? 'warning' : 'danger'
  }

  getTableData() {
    this.isLoading.set(true);
    this.isVisible = true;
    this._httpService.getData<ITableData[]>({
      _page: this.page,
      _limit: this.rows,
      _sort: this.sortField,
      _order: this.sortValue,
      q: this.search?.value,
    })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const count = res.headers.get('x-total-count')

          if (count) {
            this.totalCount = Number(count)
          }

          if (res.body) {
            this.tableData = res.body;
          }
          this.isVisible = false;
          this.isLoading.set(false)
        },
      })
  }

  customSort(e: SortMeta) {
    this.sortField = e.field;
    this.sortValue = e.order > 0 ? 'asc' : `desc`;
    this.getTableData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
