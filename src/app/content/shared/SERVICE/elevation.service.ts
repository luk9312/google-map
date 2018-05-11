import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publishLast';

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
  // configUrl: string = 'https://api.open-elevation.com/api/v1/lookup';
  // googleUrl: string ='https://maps.googleapis.com/maps/api/elevation/json?path=';
  key: string = 'AIzaSyChNp26bxuiShNlfPPoWsNlfXCZtCFeZEo';
  data$: Observable<any> = null;
  dataSet;
  length:number;


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
    this.data$ = this.http.post('https://us-central1-d-mapping.cloudfunctions.net/api/',data,httpOptions)
      .map((x) => {
        let data = this.flatten(x);
        return data
      })
      .publishLast()
      .refCount()
  }

  flatten (arr) {
    let result =[]
    arr.forEach(element => {
      element.forEach(point => {
        result = [...result, point];
      });
    });
    return result
  }

  get(): Observable<any> {
    return this.data$.map(x => console.log(x));
}

}