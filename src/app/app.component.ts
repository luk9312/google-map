import { Component, ElementRef, NgModule, NgZone, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { FormControl, FormsModule } from "@angular/forms";

import { MouseEvent, MapsAPILoader, AgmPolygon, LatLng } from '@agm/core';
import {} from '@types/googlemaps';
import { Observable } from 'rxjs/Observable';

import { ElevationService } from './elevation.service';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';

declare var google: any;

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
  visible: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  // google maps zoom level
  zoom: number;
  
  // initial center position for the map
  lat: number;
  lng: number;
  type: string;
  height: number;
  marker: marker;
  public searchControl: FormControl;
  listOfP: LatLng[][] = [];
  eleData:Promise<any>;

  testpoint;

  // set paths
  selectedArea = [];
  
  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild(AgmPolygon)
  selected:AgmPolygon;
  

  constructor(
    private elevation: ElevationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http:HttpClient
  ){}

  ngOnInit(){
    // initial map
    this.zoom = 12;
    this.lat = 43.473478949190415;
    this.lng = -80.54589994476481;
    this.type = "terrain";
    // initial center point as marker
    this.marker = {
      lat: this.lat,
      lng: this.lng,
      label: 'C',
      draggable: true,
      visible: true
    };

    //create search FormControl
    this.searchControl = new FormControl();


    //load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //     types: ["address"]
    //   });
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       //get the place result
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
    //       //verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
          
    //       //set latitude, longitude and zoom
    //       this.lat = place.geometry.location.lat();
    //       this.lng = place.geometry.location.lng();
    //       this.marker.lat = place.geometry.location.lat();
    //       this.marker.lng = place.geometry.location.lng();
    //       this.zoom = 8;
    //       this.selectedArea=[];
    //       console.log('marker',this.marker.lat, this.marker.lng);
    //       this.setNewPaths(this.marker.lat, this.marker.lng);
    //     });
    //   });
    // });
  }

  setup($event){
    this.selectedArea=[];
    console.log('marker',this.marker.lat, this.marker.lng);
    this.setNewPaths(this.marker.lat, this.marker.lng);
  }

  setNewPaths(lat:number, lng: number) {
    let origin = new google.maps.LatLng(lat, lng);
    let ne = google.maps.geometry.spherical.computeOffset(origin, 50000, 0);
    ne = google.maps.geometry.spherical.computeOffset(ne, 50000, 90);
    this.selectedArea[0]={lat: ne.lat(),lng: ne.lng()};
    let se = google.maps.geometry.spherical.computeOffset(ne, 100000, 180);
    this.selectedArea[1]={lat: se.lat(),lng: se.lng()};
    let sw = google.maps.geometry.spherical.computeOffset(se, 100000, 270);
    this.selectedArea[2]={lat: sw.lat(),lng: sw.lng()};
    let nw = google.maps.geometry.spherical.computeOffset(sw, 100000, 0);
    this.selectedArea[3]={lat: nw.lat(),lng: nw.lng()};
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.listOfP = [];
    this.selectedArea = [];
    this.setNewPaths(this.marker.lat, this.marker.lng);

    let pointnw =  new google.maps.LatLng(this.selectedArea[3].lat, this.selectedArea[3].lng);
    let pointne =  new google.maps.LatLng(this.selectedArea[0].lat, this.selectedArea[0].lng);
    let pointse =  new google.maps.LatLng(this.selectedArea[1].lat, this.selectedArea[1].lng);
    let pointsw =  new google.maps.LatLng(this.selectedArea[2].lat, this.selectedArea[2].lng);
    this.getSelectedCoor(pointnw, pointne, pointsw, pointse);

    this.testing(this.listOfP);
    

  }
  
  getSelectedCoor (nw,ne,sw,se){
    let startPoint: LatLng
    let endPoint :LatLng
    let result: LatLng[] = [];
    for(let i = 0 ; i < 200 ; i++) {
      // for (let j = 0; j < 200 ; j++) {
      //   point = google.maps.geometry.spherical.interpolate(startPoint, endPoint, (0.005*j));
      //   result=[...result, point];
      // }
      startPoint = google.maps.geometry.spherical.interpolate(nw, sw, (0.005*i));
      endPoint = google.maps.geometry.spherical.interpolate(ne, se, (0.005*i));
      this.listOfP = [...this.listOfP, [startPoint, endPoint]];
    }
  }

  // getElevation (arr) {
  //   this.elevation.getData(arr).subscribe(resp => {
  //     let dataSet = resp.results;
  //     this.eleData = [... this.eleData, dataSet];
  //     console.log(dataSet);
  //   })
  // }
  testing(arr){
    let highpoint = new google.maps.LatLng(27.986065, 86.922623)
    let lowpoint = new google.maps.LatLng(11.3499986, 142.1999992);
    this.elevation.getData([lowpoint]);
    // this.eleData = this.elevation.testing(arr)
      // .then(result => {
      //   console.log(result);
      //   this.eleData = result
      // });
  }


}
