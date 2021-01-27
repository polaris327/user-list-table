import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './components/add-user/add-user.component';
import { User } from  './interfaces/user.interface';

const MOCK_USER_LIST: User[] = [
  {name: 'Manuel Jin', email: 'reactangulardev@gmail.com', phone: '+17205235918'},
  {name: 'Samule Gold', email: 'samule.gold@gmail.com', phone: '+15152345623'},
  {name: 'Dan Tolman', email: 'dan.tolman@gmail.com', phone: '+19172324192'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'action'];
  userList: User[] = MOCK_USER_LIST;

  addForm: FormGroup = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.required]],
    });
  }

  get addFormControls () {
    return this.addForm.controls;
  }

  openAddUserDlg() {
    const dialogRef = this.dialog.open(AddUserComponent);

    dialogRef.afterClosed().subscribe((user: User) => {
      if (user) {
        this.userList = [...this.userList, user];
      }
    });
  }

  onClick(user: User, property) {
    this.userList.forEach(item => item.editingCell = null);
    this.submitted = false;
    user.editingCell = property;
    this.addFormControls.name.patchValue(user.name);
    this.addFormControls.email.patchValue(user.email);
    this.addFormControls.phone.patchValue(user.phone);
  }

  updateUser(user: User) {
    this.submitted = true;
    if (user.editingCell === 'name' && this.addFormControls.name.valid) {
      user.name = this.addFormControls.name.value;
      user.editingCell = null;
    } else if (user.editingCell === 'email' && this.addFormControls.email.valid) {
      user.email = this.addFormControls.email.value;
      user.editingCell = null;
    } else if (user.editingCell === 'phone' && this.addFormControls.phone.valid) {
      user.phone = this.addFormControls.phone.value;
      user.editingCell = null;
    }
  }

  cancelUpdate(user: User) {
    user.editingCell = null;
  }

  deleteUser(user: User) {
    const idxToRemove = this.userList.findIndex(item => item.email === user.email);
    if (idxToRemove > -1) {
      this.userList.splice(idxToRemove, 1);
      this.userList = [...this.userList];
    }
  }
}
