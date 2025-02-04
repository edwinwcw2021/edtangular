import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ApicallService } from '../services/apicall.service';
import { Books } from '../model/model';
import { catchError, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingComponent } from '../controls/loading.component';
import { BorrowComponent } from '../controls/borrow.component';
@Component({
  selector: 'app-book',
  standalone: false,

  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent { //implements OnInit {
  books : Books[]
  loadingRef : any;
  borrowRef : any;
  keywords : string = ''
  errorMessage = ''
  pageSizeOptions =20;
  noOfRecords = 0;
  isSearchedBooks : boolean = false;
  dataSource  = new MatTableDataSource<Books>();
  displayedColumns: string[] = ["isbn","bookTitle"];
  @ViewChild('bottomPaginator') bottomPaginator!: MatPaginator;

  private apiServer = inject(ApicallService);
  private loadingPanel = inject(MatDialog);
  private borrowPanel = inject(MatDialog);


  constructor() {
  }

  ngOnInit(): void {
  }

  CheckAvailable(isbn:string):void {
    this.openEdit(isbn);
  }

  onClearText():void {
    this.keywords ="";
  }

  ShowRecords() : string
  {
    if(this.isSearchedBooks)
      return "Number of record(s): "+ this.noOfRecords;
    else
      return "";
  }

  GetData(): void {
    // if(this.keywords.length<3) {
    //   this.errorMessage = "The minimum length for keywords is three characters.";
    //   this.books = [];
    //   this.dataSource.data = this.getTableData(0);
    //   this.bottomPaginator.length = 0;
    //   return;
    // }
    this.openLoading();
    this.isSearchedBooks= true;
    this.errorMessage = "";
    this.apiServer.GetBooksByKeyWords(this.keywords).pipe<Books[]>(
      catchError(error=> {
          console.log(error['error']['detail'])
          console.log(error['error']['detail']!=undefined)
          if(error['error']['detail']!=undefined) {
            this.errorMessage = error['error']['detail'];
          }
          if(!environment.production) {
            console.log(error);
          }
          this.books = [];
          this.dataSource.data = this.getTableData(0);
          this.closeLoading();
          this.bottomPaginator.length = 0;
          return from([]); } ))
        .subscribe(data=>{
           this.closeLoading();
          if(data!=null) {
            this.books = data;
            if(!environment.production)
              console.log(this.books);
            this.noOfRecords = this.books.length;
            this.dataSource.data = this.getTableData(0);
            this.bottomPaginator.length = this.noOfRecords;
          } else {
            this.books = [];
            this.bottomPaginator.length = 0;
          }
        });

  }

  openEdit(isbn:string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = isbn;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 380;
    dialogConfig.minHeight = 440;
    this.borrowRef = this.borrowPanel.open(BorrowComponent, dialogConfig);
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

  onPageChange(e:PageEvent) {
    this.bottomPaginator.pageIndex = e.pageIndex;
    this.dataSource.data=this.getTableData(e.pageIndex);
  }

  getTableData(page:number) {
    return this.books.filter((value, index) => index >= page * this.bottomPaginator.pageSize && index < (page + 1) * this.bottomPaginator.pageSize);
  }
}
