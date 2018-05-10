import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{

  title: String = '3D Lanscape generator';

  constructor(
  ){}

  ngOnInit(){
    
  }
}
