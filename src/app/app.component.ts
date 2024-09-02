import { Component, OnInit, signal } from '@angular/core';
import { HttpService } from './services/http.service'
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { take } from 'rxjs'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';

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
  ],
})
export class AppComponent implements OnInit {
  tableData: any = []
  
  page = 1;

  rows = 10;

  isLoading = signal(true)

  visible = false;

  showDialog() {
      this.visible = true;
  }

  constructor(private _httpService: HttpService) {}

  ngOnInit(): void {
    this.getTableData()
  }

  onPageChange(e: any) {
    this.isLoading.set(true)
    this.visible = true;
    this.rows = e.rows;
    this.page = e.page + 1;
    this.getTableData()
  }

  getFullName(row: any) {
    return `${row.name?.first} ${row.name?.last}`
  }

  getTableData() {
    this._httpService.getData({
      _page: this.page,
      _per_page: this.rows
    })
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.tableData = data
          this.isLoading.set(false)
          this.visible = false;
        },
      })
  }
}
