import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee dashboard modal';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  [x: string]: any;
  public signupForm!: FormGroup;
  showadd !: boolean;
  showupdate !: boolean;
  employeeData !: any;
  employeemodelobj : EmployeeModel = new EmployeeModel();
  constructor(private api : ApiService) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      
      fullName: new FormControl('', [
        Validators.required,
        Validators.maxLength(90),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(90),
      ]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[6-9]\\d{9}'),
      ]),
      emailAddress: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      salary: new FormControl('', [
        Validators.required,
      ]),
    });

    this.getalldata();
  }

  clickaddemployee(){
    this.signupForm.reset();
    this.showadd = true;
    this.showupdate = false;
  }
  isNumberKey(evt: any) {
    if (
      (evt.key >= '0' && evt.key <= '9') ||
      evt.key == 'Backspace' ||
      evt.key == 'Delete' ||
      evt.key == 'ArrowLeft' ||
      evt.key == 'ArrowRight'
    ) {
      return true;
    }
    return false;
  }

  postEmployeedetail(){
    console.log(this.signupForm.status);
    if(this.signupForm.status == 'VALID'){
    this.employeemodelobj.firstname = this.signupForm.value.fullName;
    this.employeemodelobj.lastname = this.signupForm.value.lastName;
    this.employeemodelobj.mobile = this.signupForm.value.mobileNumber;
    this.employeemodelobj.email = this.signupForm.value.emailAddress;
    this.employeemodelobj.salary = this.signupForm.value.salary;

    this.api.postEmployee(this.employeemodelobj)
    .subscribe(res=>{
      console.log(res);
      alert("Employee added Successfully")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.signupForm.reset()
      this.getalldata();
    },
    err=>{
      
      alert("Something went wrong")
    })
  }
  else{
    this.signupForm.markAllAsTouched();
  }
  }
  getalldata(){
    this.api.getEmployee()
    .subscribe(res=>{
      this.employeeData = res;
    })
  }

  deleteEmployee(data :any){
    console.log("jai singh")
    this.api.deleteEmployee(data.id)
    .subscribe(res=>{
      alert("Employee details successfully removed from database");
      this.getalldata();
    })
  }

  onedit(data : any){
    this.showadd = false;
    this.showupdate = true;
    this.employeemodelobj.id = data.id;
    this.signupForm.controls['fullName'].setValue(data.firstname);
    this.signupForm.controls['lastName'].setValue(data.lastname);
    this.signupForm.controls['mobileNumber'].setValue(data.mobile);
    this.signupForm.controls['emailAddress'].setValue(data.email);
    this.signupForm.controls['salary'].setValue(data.salary);
  }

  updateemployeedata(){
    this.employeemodelobj.firstname = this.signupForm.value.fullName;
    this.employeemodelobj.lastname = this.signupForm.value.lastName;
    this.employeemodelobj.mobile = this.signupForm.value.mobileNumber;
    this.employeemodelobj.email = this.signupForm.value.emailAddress;
    this.employeemodelobj.salary = this.signupForm.value.salary;
    this.api.updateEmployee(this.employeemodelobj,this.employeemodelobj.id)
    .subscribe(res=>{
      alert("Employee Details updated successfully");
      let ref = document.getElementById('cancel')
      ref?.click();
      this.signupForm.reset()
      this.getalldata();
    })
  }
}
