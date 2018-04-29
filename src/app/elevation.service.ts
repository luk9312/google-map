import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/take';
import * as PromisePool from 'es6-promise-pool';
import { GoogleMapsAPIWrapper } from '@agm/core';

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
  result = [];
  count = 1;

  constructor(
    private http:HttpClient,
    private _wrapper:GoogleMapsAPIWrapper
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

    let param =this.sample
    let output = [];
    // let LofP =arr.map(pair => {
    //   this.elevationPromise(pair, param).then(result => {
    //     console.log(result);
    //   })
    // });
    return this.delayMap(2000, [arr,param])
      .then(Promise.all.bind(Promise))
        .then(result => {
          result.forEach(list => {
            list.forEach(item => {
              output = [...output,item];
            })
          });
          console.log('result',result);
          return output;})
        .catch(err => console.log('Error', err));
    // Promise.all(LofP)
    //   .then(result => {
        // result.forEach(list => {
        //   list.forEach(item => {
        //     output = [...output,item];
        //   })
        // });
        // console.log('result',result);
        // return output;})
    //   .catch(err => console.log('Error', err));
  }

  elevationPromise(arr, param) {
    let elevator = new google.maps.ElevationService
    console.log('debug',arr);
    return new Promise((resolve,reject) => {
      elevator.getElevationAlongPath({
        'path': arr,
        'samples': param
      },function(results, status) {
        if (status == google.maps.ElevationStatus.OK) {
          // resolve results upon a successful status
          resolve(results);
        } else {
          // reject status upon un-successful status
          reject(status);
        }
      })
    })
  }

  sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  delayMap = async (ms, arr) => {
    const results = []
    for (const item of arr[0]) {
      results.push(await this.elevationPromise(item, arr[1]))
      await this.sleep(ms)
    }
    return results
  }

}