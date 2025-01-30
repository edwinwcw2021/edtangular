import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BorrowHistory, Users, vwAvailableBook } from '../model/model';
import { ApicallService } from '../services/apicall.service';
import { catchError, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoadingComponent } from '../controls/loading.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  standalone: false,

  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  loadingRef : any;
  available: vwAvailableBook[]=[];
  users : Users[] = [];
  UserId : number = -1;
  statusText:string = "";
  errorText:string = "";

  private apiServer = inject(ApicallService);
  private loadingPanel = inject(MatDialog);
  dataSource  = new MatTableDataSource<vwAvailableBook>();
  pageSizeOptions =20;
  errorMessage = "";
  displayedColumns: string[] = ["userName","bookTitle"];
  @ViewChild('bottomPaginator') bottomPaginator!: MatPaginator;

  ngOnInit(): void {
    this.refreshData();
    // this.openLoading();
    // this.apiServer.GetAllUsers().pipe<Users[]>(
    //   catchError(error=> {
    //     if(!environment.production)
    //       console.log(error);
    //     this.users = [];
    //     this.closeLoading();
    //     return from([]); } ))
    //   .subscribe(data=>{
    //     this.closeLoading();
    //     if(data!=null) {
    //       this.users = data;
    //       this.refreshData();
    //     } else {
    //       this.users = [];
    //     }
    //   });
  }

  refreshData() {
    this.openLoading();
    // let para = this.paradata;
    this.apiServer.GetAllBorrowedInventory().pipe<vwAvailableBook[]>(
      catchError(error=> {
        if(!environment.production)
          console.log(error);
        this.available = [];
        this.dataSource.data =[];
        this.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.closeLoading();
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
    this.openLoading();
    this.apiServer.BorrowBookReturn(copy).pipe<BorrowHistory>(
      catchError(error => {
        this.statusText = "";
        this.errorText = error["error"]["details"];
        this.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.closeLoading();
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
  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.loadingRef = this.loadingPanel.open(LoadingComponent, dialogConfig);
  }
  closeLoading() {
    this.loadingRef.close();
  }

}
