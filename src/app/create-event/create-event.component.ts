import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {merge} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-create-event',
  
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    MatNativeDateModule,  // Add this line
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule, MatDividerModule, MatIconModule

   ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventComponent {
value: any;

  // value:Date | undefined;

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

}
function localTakeUntilDestroyed(): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}




