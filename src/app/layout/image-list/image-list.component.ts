import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { StoreService } from '../../services/store.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppConst } from '../../helper/app-const';
import { SharedService } from '../../services/shared.service';
import { listImage, viewImageData } from '../layout.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { take } from 'rxjs';
import { ImageCardComponent } from '../../shared/image-card/image-card.component';
import { UploadImageDialogComponent } from '../../shared/upload-image-dialog/upload-image-dialog.component';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    InfiniteScrollModule,
    UploadImageDialogComponent,
    NgxSkeletonLoaderModule,
    ImageCardComponent,
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.scss',
})
export class ImageListComponent implements OnChanges {
  imageList: listImage[] = [];
  @Input() searchData: string = '';
  @Input() tagData: string = '';
  appConst = AppConst;
  lastVisible!: any;
  private storeService = inject(StoreService);
  private sharedService = inject(SharedService);
  private dialog = inject(MatDialog);
  isLoding = false;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('onchnage', changes);
    this.resetImageArray();
    if (this.searchData == '' && this.tagData == '') {
      this.getPagiNation();
    }
    if (this.searchData || this.tagData) {
      console.log('object');
      this.loadItems();
    }
  }
  resetImageArray() {
    this.imageList = [];
    this.lastVisible = null;
  }

  loadItems() {
    console.log(this.searchData, this.tagData);
    this.isLoding = true;
    this.storeService
      .getFilteredData(this.searchData, this.tagData)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoding = false;
          console.log(res);
          if (res.length > 0) {
            console.log(res);
            this.lastVisible = res[res.length - 1];
            this.imageList = res;
          }
        },
      });
  }

  getPagiNation() {
    console.log(this.lastVisible);
    this.isLoding = true;
    this.storeService
      .getPaginatedData(this.lastVisible)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.isLoding = false;
          console.log(res);
          if (res.length > 0) {
            console.log(res);
            this.lastVisible = res[res.length - 1];
            this.imageList = this.imageList.concat(res);
          }
        },
      });
  }
  //upload image dialog
  uploadImageDialog() {
    const dialogRef = this.dialog.open(UploadImageDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == 'yes') {
        this.resetImageArray();
        this.loadItems();
        this.sharedService.loggerSuccess('File uploaded successfully.');
      }
    });
  }

  viewDialog(e:viewImageData){
    console.log(e);
    if(e.type == 'view'){
      const dialogRef = this.dialog.open(UploadImageDialogComponent,{
        data: e
      });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == 'yes') {
      }
    });
    }
  }

  onScroll() {
    if (this.searchData == '' && this.tagData == '') this.getPagiNation();
  }
}
