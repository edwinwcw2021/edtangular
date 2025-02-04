import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingComponent } from '../controls/loading.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingRef : any;
  private loadingPanel = inject(MatDialog);

  constructor() {}

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
