import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTabsModule],
})
export class SettingComponent {
  // Role guidance logic here if needed
}
