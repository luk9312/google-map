import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  configUrl = 'https://api.open-elevation.com/api/v1/lookup';

  constructor(
    private http:HttpClient
  ) {}

  getData(arr) {

    let location = arr.map(latlng => {
      return {
        'latitude': latlng.lat(),
        "longitude": latlng.lng()
      }
    });
    let request = {
      'locations': location
    };

    return this.http.post<Result>(this.configUrl,request,httpOptions);
  }
}