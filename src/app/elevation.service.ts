import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/take';
import * as PromisePool from 'es6-promise-pool';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type':  'application/json'
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
  result = [];
  count = 1;

  testpoint = [];


  constructor(
    private http:HttpClient
  ) {}

  getSelectedCoor (nw,ne,sw,se){
    let startPoint: google.maps.LatLng
    let endPoint :google.maps.LatLng
    let result: google.maps.LatLng[][] = [];
    for(let i = 0 ; i < 200 ; i++) {
      startPoint = google.maps.geometry.spherical.interpolate(nw, sw, (0.005*i));
      endPoint = google.maps.geometry.spherical.interpolate(ne, se, (0.005*i));
      result = [...result, [startPoint, endPoint]];
    }
    return result
  }

  getElevation (nw, ne, sw, se) {
    let data ={
      locations: this.getSelectedCoor(nw, ne, sw, se)
    }
    return this.http.post('https://us-central1-d-mapping.cloudfunctions.net/api/',data,httpOptions);
  }


}