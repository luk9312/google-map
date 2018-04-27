import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/take';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};
export interface LatLngElv {
  latitude : number
  longitude : number
  elevation : number
}


export interface Result {
  results: LatLngElv[];
}

@Injectable()
export class ElevationService {
  configUrl: string = 'https://api.open-elevation.com/api/v1/lookup';
  googleUrl: string ='https://maps.googleapis.com/maps/api/elevation/json?path=';
  sample: number = 200;
  key: string = 'AIzaSyChNp26bxuiShNlfPPoWsNlfXCZtCFeZEo';
  result=[];

  constructor(
    private http:HttpClient
  ) {}

  // getData(arr) {

  //   let location = arr.map(latlng => {
  //     return {
  //       'latitude': latlng.lat(),
  //       "longitude": latlng.lng()
  //     }
  //   });
  //   let request = {
  //     'locations': location
  //   };

  //   return this.http.post<Result>(this.configUrl,request,httpOptions);
  // }

  testing(arr){
    let elevator = new google.maps.ElevationService
    console.log('debug',arr);
    elevator.getElevationAlongPath({
      'path': arr[0],
      'samples': this.sample
    },(elevations, status) => {
      console.log('status',status);
      console.log('elevations',elevations.map(x => x.location.lat()));
      if (status !== 'OK') {
        return;
      }
      this.result = [...this.result,elevations];
      if ( arr.length !== 1){
        arr.shift()
        setTimeout(() => {
          this.testing(arr);
        },5000);
      }
    })
    return this.result;
  }

}