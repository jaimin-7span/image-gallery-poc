import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  search!:string
  @Output() toggleMenu: EventEmitter<boolean> = new EventEmitter();
  @Output() searchInput: EventEmitter<string> = new EventEmitter();
  toggleSidebar(){
    this.toggleMenu.emit(true);
  }

  searchData(){
    console.log(this.search);
    this.searchInput.emit(this.search)
  }
}
