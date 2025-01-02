import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
constructor(public http : HttpClient){
  
}

public timeSlots : any = []
public updatedTimeSlotes : any = []
public appoinmentForm = new FormGroup({
  name : new FormControl('',Validators.required),
  p_no : new FormControl('',Validators.required),
  date : new FormControl('',Validators.required),
  time : new FormControl('',Validators.required)
})
ngOnInit(){
  const startTime = 10; // Start time in hours
    const endTime = 17; // End time in hours
    const breakStart = 13; // Break start time in hours
    const breakEnd = 14; // Break end time in hours

    for (let hour = startTime; hour < endTime; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        if (hour >= breakStart && hour < breakEnd) continue;

        const formattedTime = this.format(hour, minutes);
        this.timeSlots.push(formattedTime);
      }
    }
    console.log(this.timeSlots,"timeSlots")
}

format(hour: number, minutes: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour > 12 ? hour - 12 : hour;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${formattedHour}:${formattedMinutes} ${period}`;
}

onSubmit(){
  this.http.post('http://localhost:4500/user/insert',{data:this.appoinmentForm.value}).toPromise().then((data)=>{
    console.log(data,"data");
    window.alert(data)
    this.appoinmentForm.reset();
  })
}
getDatefun(){
  console.log("check")
  this.http.post('http://localhost:4500/user/getDate',{data:this.appoinmentForm.value.date}).toPromise().then((data)=>{
    this.alterDate(data)
  })
}
alterDate(data : any){
  this.updatedTimeSlotes = [];
  let times: any = data.map((item: any) => item.time)
if(data.length) {
  this.timeSlots.forEach((element :any ) => {
  if(!times.includes(element)){
this.updatedTimeSlotes.push(element)
  }
  
});
}
console.log(this.updatedTimeSlotes,"updatedTimeSlotes")
}


}
