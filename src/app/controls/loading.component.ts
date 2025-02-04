import { Component, inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-loading',
  standalone: false,

  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  private loadingRef = inject(MatDialogRef<LoadingComponent>);
  // private dialog = inject(MatDialog);

  constructor(private dialog : MatDialog) {}

  openLoading() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.loadingRef = this.dialog.open(LoadingComponent, dialogConfig);
  }

  closeLoading() {
    if (this.loadingRef) {
      this.loadingRef.close();
    }
  }
}
