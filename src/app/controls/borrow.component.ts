import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BorrowHistory, BorrowInput, Users, vwAvailableBook } from '../model/model';
import { ApicallService } from '../services/apicall.service';
import { DatePipe } from '@angular/common';
import { catchError, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoadingComponent } from './loading.component';

@Component({
  selector: 'app-borrow',
  standalone: false,

  templateUrl: './borrow.component.html',
  styleUrl: './borrow.component.css'
})
export class BorrowComponent implements OnInit {
  loadingRef : any;
  users : Users[] = [];
  available: vwAvailableBook[]=[];
  public paradata:string = inject(MAT_DIALOG_DATA);
  private apiServer = inject(ApicallService);
  private loadingPanel = inject(MatDialog);
  // private datePipe = inject(DatePipe);
  private dialogRef = inject(MatDialogRef<BorrowComponent>)
  UserId:number =-1;
  statusText:string = "";
  errorText:string = "";

  constructor()
  {
  }

  Borrow(copy:number):void {
    if(this.UserId<0) {
      this.statusText = "";
      this.errorText = "Please select one user";
      return;
    }
    let postData : BorrowInput =
    {
        userId: this.UserId,
        bookInventoryId: copy
    };
    this.openLoading();
    this.apiServer.BorrowAvailableBook(postData).pipe<BorrowHistory>(
      catchError(error => {
        this.statusText = "";
        this.errorText = error["error"]["detail"];
        // if(!environment.production)
        //   console.log(error);
        this.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.closeLoading();
        if(data!=null) {
          this.refreshAvailable();
          this.errorText = "";
          this.statusText = "Borrow Successfully!!!";
          // if(!environment.production)
          //   console.log(data);
        }
      });
  }

  Return(copy:number):void {
    this.openLoading();
    this.apiServer.BorrowBookReturn(copy).pipe<BorrowHistory>(
      catchError(error => {
        this.statusText = "";
        this.errorText = error["error"]["details"];
        // if(!environment.production)
        //   console.log(error);
        this.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.closeLoading();
        if(data!=null) {
          this.errorText = "";
          this.statusText = "Return Successfully!!!";
          this.refreshAvailable();
          // if(!environment.production)
          //   console.log(data);
        }
      });
  }

  ngOnInit(): void {
    this.openLoading();
    this.apiServer.GetAllUsers().pipe<Users[]>(
      catchError(error=> {
        if(!environment.production)
          console.log(error);
        this.users = [];
        this.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.closeLoading();
        this.refreshAvailable();
        if(data!=null) {
          this.users = data;
        } else {
          this.users = [];
        }
      });

  }

  refreshAvailable() {
    this.openLoading();
    let para = this.paradata;
    this.apiServer.GetAvailableInventoryByISBN(para).pipe<vwAvailableBook[]>(
      catchError(error=> {
        if(!environment.production)
          console.log(error);
        this.available = [];
        this.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.closeLoading();
        if(data!=null) {
          this.available = data;
        } else {
          this.available = [];
        }
      });
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

  closeMe() {
    this.dialogRef.close();
  }
}
