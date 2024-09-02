import { Component, OnInit, signal } from '@angular/core';
import { HttpService } from './services/http.service'
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { take } from 'rxjs'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { FavFruit, IData, ITableData } from './common/interfaces'
import { SortMeta } from 'primeng/api'
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    PaginatorModule,
    ProgressSpinnerModule,
    DialogModule,
    CheckboxModule,
    AvatarModule,
    TagModule,
  ],
})
export class AppComponent implements OnInit {
  tableData!: IData;
  
  page: number | undefined = 1;

  rows: number | undefined = 10;

  sortField: string | null = null;

  isLoading = signal(true);

  isVisible = false;

  constructor(private _httpService: HttpService) {}

  ngOnInit(): void {
    this.getTableData()
  }

  onPageChange(e: PaginatorState) {
    this.isLoading.set(true)
    this.isVisible = true;
    this.rows = e.rows;
    this.page = e.page !== undefined ? e.page + 1 : undefined;
    this.getTableData()
  }

  get isShowSpinner() {
    return this.isLoading() && !this.tableData?.data
  }

  getFullName(row: ITableData) {
    return `${row.name?.first} ${row.name?.last}`
  }

  getFavFruit(fruit: FavFruit) {
    return fruit === FavFruit.apple ? 'success' : fruit === FavFruit.banana ? 'warning' : 'danger'
  }

  getTableData() {
    this._httpService.getData<IData>({
      _page: this.page,
      _per_page: this.rows,
      _sort: this.sortField,
    })
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.tableData = data
          this.isVisible = false;
          this.isLoading.set(false)
        },
      })
  }

  customSort(e: SortMeta) {
    this.isLoading.set(true);
    this.isVisible = true;
    this.sortField = e.order > 0 ? e.field : `-${e.field}`;
    this.getTableData();
  }
}
