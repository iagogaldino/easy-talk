import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersService } from '../../services/users.service';
import { UserRole, User } from '../../models/user.model';
import { UsersManagementWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-users-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: './widget-users-management.component.html',
  styleUrls: ['./widget-users-management.component.scss']
})
export class WidgetUsersManagementComponent implements OnInit {
  @Input() widget!: UsersManagementWidget;
  
  userForm: FormGroup;
  users: User[] = [];
  dataSource = new MatTableDataSource<User>([]);
  isLoading = false;
  isCreating = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  displayedColumns: string[] = ['name', 'email', 'role', 'active', 'createdAt', 'actions'];

  readonly roles = [
    { value: UserRole.EMPLOYEE, label: 'Employee' },
    { value: UserRole.ADMIN, label: 'Admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.EMPLOYEE, Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.users) {
          this.users = response.users;
          this.dataSource.data = this.users;
        } else {
          this.errorMessage = response.error || 'Failed to load users';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.error || error.message || 'An error occurred while loading users';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;

    const userData = this.userForm.value;

    this.usersService.createUser(userData).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.successMessage = 'User created successfully!';
          this.userForm.reset({
            role: UserRole.EMPLOYEE,
            active: true
          });
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges();
          }, 3000);
        } else {
          this.errorMessage = response.error || 'Failed to create user';
        }
        this.isCreating = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.error || error.message || 'An error occurred while creating the user';
        this.isCreating = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser(user: User): void {
    if (!user._id) return;

    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    this.isLoading = true;
    this.usersService.deleteUser(user._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'User deleted successfully!';
          this.loadUsers();
          setTimeout(() => {
            this.successMessage = null;
            this.cdr.detectChanges();
          }, 3000);
        } else {
          this.errorMessage = response.error || 'Failed to delete user';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.error || error.message || 'An error occurred while deleting the user';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleUserActive(user: User): void {
    if (!user._id) return;

    this.isLoading = true;
    this.usersService.updateUser(user._id, { active: !user.active }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadUsers();
        } else {
          this.errorMessage = response.error || 'Failed to update user';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.error || error.message || 'An error occurred while updating the user';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getRoleLabel(role: string): string {
    return role === UserRole.ADMIN ? 'Admin' : 'Employee';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

