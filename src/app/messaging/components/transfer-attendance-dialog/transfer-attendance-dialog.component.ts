import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersService } from '../../../admin/services/users.service';
import { User, UserRole } from '../../../admin/models/user.model';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transfer-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './transfer-attendance-dialog.component.html',
  styleUrls: ['./transfer-attendance-dialog.component.scss']
})
export class TransferAttendanceDialogComponent implements OnInit {
  searchControl = new FormControl('');
  employees: User[] = [];
  filteredEmployees$!: Observable<User[]>;
  isLoading = false;
  selectedEmployee: User | null = null;
  errorMessage: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<TransferAttendanceDialogComponent>,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    
    // Setup filter
    this.filteredEmployees$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(searchTerm => this.filterEmployees(searchTerm || ''))
    );
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.users) {
          // Filter only employees (not admins)
          this.employees = response.users.filter(user => 
            user.role === UserRole.EMPLOYEE && user.active
          );
        } else {
          this.errorMessage = response.error || 'Failed to load employees';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.error || error.message || 'An error occurred while loading employees';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterEmployees(searchTerm: string): User[] {
    if (!searchTerm) {
      return this.employees;
    }

    const term = searchTerm.toLowerCase();
    return this.employees.filter(employee =>
      employee.name.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term)
    );
  }

  selectEmployee(employee: User): void {
    this.selectedEmployee = employee;
  }

  onTransfer(): void {
    if (this.selectedEmployee) {
      this.dialogRef.close(this.selectedEmployee);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  trackByEmployeeId(_index: number, employee: User): string {
    return employee._id || '';
  }
}

