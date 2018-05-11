import { Component, ElementRef, NgModule, NgZone, OnInit, AfterViewInit, ViewChild, OnDestroy, EventEmitter} from '@angular/core';
import { FormControl, FormsModule, FormGroup } from "@angular/forms";

import { MouseEvent, MapsAPILoader, AgmPolygon, LatLng } from '@agm/core';
import {} from '@types/googlemaps';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ElevationService } from '../shared/service/elevation.service';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';


declare var google: any;

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
  visible: boolean
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy{
  // google maps zoom level
  zoom: number = 8;
  length:number = 100;
  
  // initial center position for the map
  lat: number;
  lng: number;
  type: string;
  height: number;
  marker: marker;
  public searchControl: FormControl;
  listOfP: google.maps.LatLng[][] = [];
  subscribe: Subscription;
  toggle:boolean = false;

  modalActions = new EventEmitter<string|MaterializeAction>();

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
    private http:HttpClient,
    private router: Router
  ){}

  ngOnInit(){
    // initial map
    if (localStorage.getItem('length') !== null) {
      this.length = Number(localStorage.getItem('length'));
    }
    if (localStorage.getItem('zoom') !== null) {
      this.zoom = Number(localStorage.getItem('zoom'));
    }
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
    
    localStorage.setItem('length', `${this.length}`);
    localStorage.setItem('zoom', `${this.zoom}`);

    //create search FormControl
    this.searchControl = new FormControl();


    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          
          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.marker.lat = place.geometry.location.lat();
          this.marker.lng = place.geometry.location.lng();
          this.selectedArea=[];
          this.setNewPaths(this.marker.lat, this.marker.lng, this.length);
        });
      });
    });
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  setup($event){
    this.selectedArea=[];
    console.log('marker',this.marker.lat, this.marker.lng);
    this.setNewPaths(this.marker.lat, this.marker.lng, this.length);
  }

  setNewPaths(lat:number, lng: number, length:number) {
    let origin = new google.maps.LatLng(lat, lng);
    const len = length*1000;
    let ne = google.maps.geometry.spherical.computeOffset(origin, len/2, 0);
    ne = google.maps.geometry.spherical.computeOffset(ne, len/2, 90);
    this.selectedArea[0]={lat: ne.lat(),lng: ne.lng()};
    let se = google.maps.geometry.spherical.computeOffset(ne, len, 180);
    this.selectedArea[1]={lat: se.lat(),lng: se.lng()};
    let sw = google.maps.geometry.spherical.computeOffset(se, len, 270);
    this.selectedArea[2]={lat: sw.lat(),lng: sw.lng()};
    let nw = google.maps.geometry.spherical.computeOffset(sw, len, 0);
    this.selectedArea[3]={lat: nw.lat(),lng: nw.lng()};
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.selectedArea = [];
    this.setNewPaths(this.marker.lat, this.marker.lng, this.length);
    console.log('marker',this.marker.lat, this.marker.lng);
  }
  
  onComfirm() {
    let pointnw =  new google.maps.LatLng(this.selectedArea[3].lat, this.selectedArea[3].lng);
    let pointne =  new google.maps.LatLng(this.selectedArea[0].lat, this.selectedArea[0].lng);
    let pointse =  new google.maps.LatLng(this.selectedArea[1].lat, this.selectedArea[1].lng);
    let pointsw =  new google.maps.LatLng(this.selectedArea[2].lat, this.selectedArea[2].lng);
    console.log('area', pointnw, pointne, pointse, pointsw);
    this.elevation.getElevation(pointnw, pointne, pointsw, pointse);
    this.subscribe =  this.elevation.data$.subscribe(
      (x) => {console.log(x)},
      (err) => {},
      () => {
        this.elevation.length = this.length;
        this.router.navigate(['/model'])
      }
    )
  }

  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  setting(event: FormGroup){
    const { length, zoom } = event.value;
    console.log('setting value: ',length,zoom)
    localStorage.setItem('length', `${length}`);
    localStorage.setItem('zoom', `${zoom}`);
    this.zoom = zoom;
    this.selectedArea = [];
    this.setNewPaths(this.marker.lat, this.marker.lng, length);
    this.closeModal();
  }
}
