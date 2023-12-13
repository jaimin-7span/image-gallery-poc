import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';
import { pipe, take } from 'rxjs';
import { listImage, tagList } from '../../layout/layout.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  providers: [StoreService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  tagsArray: tagList[] = [];
  private storeService = inject(StoreService);
  selectedTag:any;
  @Output() tagName: EventEmitter<string> = new EventEmitter();
  constructor() {
    
  }
  ngOnInit(): void {
    this.storeService.getGalleryList().subscribe({
      next:(result) => {
      this.tagsArray = [];
      if(result.length> 0)
      result.forEach((item:listImage) => {
        item.tags.forEach((e:string)=>{
          if (
            !this.tagsArray.some(
              (existingItem:tagList) => existingItem.tagName === e
            )
          ) {
            this.tagsArray.push(this.selectedTag && this.selectedTag.tagName ==  e ? { tagName: e, isActive: true } :{ tagName: e, isActive: false });
          }
        })
        
      });
    }});
  }

  onTagFilter(tagData: tagList) {
    this.tagsArray.forEach(item => {
      if (item.tagName !== tagData.tagName) {
        item.isActive = false;
      }
    });
    tagData.isActive = !tagData.isActive;
    this.selectedTag = tagData;
    this.tagName.emit(tagData.isActive ? tagData.tagName: '');
  }

  onResetFilter(){
    this.selectedTag = null
    this.tagsArray.forEach(item => item.isActive = false);
    this.tagName.emit('')
  }
}
