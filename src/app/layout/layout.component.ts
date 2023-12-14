import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../app/core/sidebar/sidebar.component'
import { ImageListComponent } from './image-list/image-list.component';
import { HeaderComponent } from '../core/header/header.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,
    MatSidenavModule,
    MatIconModule,
    HeaderComponent,
    SidebarComponent,
    ImageListComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  @ViewChild('drawer', { static: true }) public drawer!: MatSidenav;
  sidebarOpened = true;
  searchByInput = ''
  searchByTag = ''
  private observer = inject(BreakpointObserver)
  constructor(){
    
  }
  ngAfterViewInit(): void {
    
    console.log(this.drawer);
    setTimeout(() => {
      this.observer.observe(['(min-width: 768px)']).subscribe((res) => {
        if (!res.matches) {
          
          this.drawer.close();
        } else {
          this.drawer.open();
          
        }
      });
    }, 0);
    
  }
  toggleSidebar() {
    this.drawer.toggle();
  }
  searchData(e:string){
    console.log(e);
    this.searchByInput = e
  }
  tagNameFilter(e:string){
    this.searchByTag = e
  }
}
