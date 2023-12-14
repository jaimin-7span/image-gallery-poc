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
import { take } from 'rxjs';
import { ImageCardComponent } from '../../shared/image-card/image-card.component';
import { UploadImageDialogComponent } from '../../shared/upload-image-dialog/upload-image-dialog.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-image-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    InfiniteScrollModule,
    UploadImageDialogComponent,
    SkeletonLoaderComponent,
    ImageCardComponent,
  ],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.scss',
})
export class ImageListComponent implements OnInit, OnChanges {
  imageList: listImage[] = [];
  @Input() searchData: string = '';
  @Input() tagData: string = '';
  appConst = AppConst;
  lastVisible!: any;
  private storeService = inject(StoreService);
  private sharedService = inject(SharedService);
  private dialog = inject(MatDialog);
  isLoading = false;
  isEmpty!:boolean
  skeletonData = {
    count: '16',
    appearance: 'circle',
    animation: 'pulse',
    theme: {
      width: '150px',
      height: '200px',
      'margin-right': '10px',
      'border-radius': '10px',
      background:
        'linear-gradient(90deg, #D9D9D9 0%, rgba(217, 217, 217, 0) 100%)',
    },
  };
  ngOnInit(): void {
    this.isLoading =true
    this.storeService.getTagList().subscribe({
      next: (res) => {
        this.resetImageArray();
        if (this.searchData == '' && this.tagData == '') {
          this.getPagiNation();
        }
        if (this.searchData || this.tagData) {
          console.log('object');
          this.loadItems();
        }
      },
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('onchnage', changes);
    this.resetImageArray();
    if (
      this.searchData == '' &&
      !changes['searchData']?.firstChange &&
      this.tagData == '' &&
      !changes['tagData']?.firstChange
    ) {
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
    this.isLoading = true;
    this.storeService
      .getFilteredData(this.searchData, this.tagData)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          
          if (res.length > 0) {
            this.isEmpty = false
            
            this.lastVisible = res[res.length - 1];
            this.imageList = res;
          }else{
            this.isEmpty = true
          }
          console.log(this.isEmpty);
        },
      });
  }

  getPagiNation() {
    console.log(this.lastVisible);
    this.isLoading = true;
    this.storeService
      .getPaginatedData(this.lastVisible)
      .pipe(take(1))
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          
          if (res.length > 0) {
            this.isEmpty = false
            
            this.lastVisible = res[res.length - 1];
            this.imageList = this.imageList.concat(res);
          }else{
            if(this.imageList.length >0){
              this.isEmpty = false
            }else{
              this.isEmpty = true
            }
          }
          console.log(this.isEmpty);
        },
      });
  }
  //upload image dialog
  uploadImageDialog() {
    const dialogRef = this.dialog.open(UploadImageDialogComponent,{
      autoFocus:false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == 'yes') {
        this.sharedService.loggerSuccess('File uploaded successfully.');
      }
    });
  }

  viewDialog(e: viewImageData) {
    console.log(e);
    if (e.type == 'view') {
      const dialogRef = this.dialog.open(UploadImageDialogComponent, {
        autoFocus:false,
        data: e,
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
