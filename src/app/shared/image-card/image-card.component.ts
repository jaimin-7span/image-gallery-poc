import { Component, EventEmitter, Input, Output } from '@angular/core';
import { listImage, viewImageData } from '../../layout/layout.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './image-card.component.html',
  styleUrl: './image-card.component.scss'
})
export class ImageCardComponent {
  @Input() imageData!:listImage;
  @Output() dialogTrigger: EventEmitter<viewImageData> = new EventEmitter();
  onViewImage(imageData:listImage){
    this.dialogTrigger.emit({type:'view',data:imageData})
  }
}
