import { Component, EventEmitter, Input, Output } from '@angular/core';
import { listImage, viewImageData } from '../../layout/layout.model';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [MatIconModule,
  SkeletonLoaderComponent],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.scss'
})
export class ImageCardComponent {
  isLoading=true;
  skeletonData ={
    count: '1',
    appearance: 'circle',
    animation: 'pulse',
    theme: {
      width: '150px',
      height: '200px',
      'border-radius': '10px',
      background:
        'linear-gradient(90deg, #D9D9D9 0%, rgba(217, 217, 217, 0) 100%)',
    },
  };
  @Input() imageData!:listImage;
  @Output() dialogTrigger: EventEmitter<viewImageData> = new EventEmitter();
  onViewImage(imageData:listImage){
    this.dialogTrigger.emit({type:'view',data:imageData})
  }

  onImageLoad(){
    this.isLoading = false
  }
}
