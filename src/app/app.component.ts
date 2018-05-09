import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  title: String = 'Angular 2 + Google map testing';

  constructor(
  ){}

  ngOnInit(){
    
  }
}
