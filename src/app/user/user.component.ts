import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BorrowHistory, Users, vwAvailableBook } from '../model/model';
import { ApicallService } from '../services/apicall.service';
import { catchError, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-user',
  standalone: false,

  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  available: vwAvailableBook[]=[];
  users : Users[] = [];
  UserId : number = -1;
  statusText:string = "";
  errorText:string = "";

  private apiServer = inject(ApicallService);
  dataSource  = new MatTableDataSource<vwAvailableBook>();
  pageSizeOptions =20;
  errorMessage = "";
  displayedColumns: string[] = ["userName","bookTitle"];
  @ViewChild('bottomPaginator') bottomPaginator!: MatPaginator;
  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.loadingService.openLoading();
    this.apiServer.GetAllBorrowedInventory().pipe<vwAvailableBook[]>(
      catchError(error=> {
        if(!environment.production)
          console.log(error);
        this.available = [];
        this.dataSource.data =[];
        this.loadingService.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.loadingService.closeLoading();
        if(data!=null) {
          this.available = data;
          if(!environment.production)
            console.log(this.available);
          let noOfRecords = this.available.length;
          this.dataSource.data = this.getTableData(0);
          this.bottomPaginator.length = noOfRecords;
        } else {
          this.available = [];
        }
      });
  }

  Return(copy:number):void {
    this.loadingService.openLoading();
    this.apiServer.BorrowBookReturn(copy).pipe<BorrowHistory>(
      catchError(error => {
        this.statusText = "";
        this.errorText = error["error"]["details"];
        this.loadingService.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.loadingService.closeLoading();
        if(data!=null) {
          this.errorText = "";
          this.statusText = "Return Successfully!!!";
          this.refreshData();
        }
      });
  }

  onPageChange(e:PageEvent) {
    this.bottomPaginator.pageIndex = e.pageIndex;
    this.dataSource.data=this.getTableData(e.pageIndex);
  }

  getTableData(page:number) {
    return this.available.filter((value, index) => index >= page * this.bottomPaginator.pageSize && index < (page + 1) * this.bottomPaginator.pageSize);
  }

  showNoData() : boolean
  {
    let ret = !((!this.dataSource.data.length) && this.errorMessage=="");
    return ret;
  }
}
