import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BorrowHistory, BorrowInput, Users, vwAvailableBook } from '../model/model';
import { ApicallService } from '../services/apicall.service';
import { catchError, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoadingComponent } from './loading.component';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-borrow',
  standalone: false,

  templateUrl: './borrow.component.html',
  styleUrl: './borrow.component.css'
})
export class BorrowComponent implements OnInit {
  users : Users[] = [];
  available: vwAvailableBook[]=[];
  public paradata:string = inject(MAT_DIALOG_DATA);
  private apiServer = inject(ApicallService);
  private dialogRef = inject(MatDialogRef<BorrowComponent>)
  private loadingService = inject(LoadingService);
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
    this.loadingService.openLoading();
    this.apiServer.BorrowAvailableBook(postData).pipe<BorrowHistory>(
      catchError(error => {
        this.statusText = "";
        this.errorText = error["error"]["detail"];
        this.loadingService.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.loadingService.closeLoading();
        if(data!=null) {
          this.refreshAvailable();
          this.errorText = "";
          this.statusText = "Borrow Successfully!!!";
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
          this.refreshAvailable();
        }
      });
  }

  ngOnInit(): void {
    this.loadingService.openLoading();
    this.apiServer.GetAllUsers().pipe<Users[]>(
      catchError(error=> {
        if(!environment.production)
          console.log(error);
        this.users = [];
        this.loadingService.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.loadingService.closeLoading();
        this.refreshAvailable();
        if(data!=null) {
          this.users = data;
        } else {
          this.users = [];
        }
      });
  }

  refreshAvailable() {
    this.loadingService.openLoading();
    let para = this.paradata;
    this.apiServer.GetAvailableInventoryByISBN(para).pipe<vwAvailableBook[]>(
      catchError(error=> {
        if(!environment.production)
          console.log(error);
        this.available = [];
        this.loadingService.closeLoading();
        return from([]); } ))
      .subscribe(data=>{
        this.loadingService.closeLoading();
        if(data!=null) {
          this.available = data;
        } else {
          this.available = [];
        }
      });
  }

  closeMe() {
    this.dialogRef.close();
  }
}
