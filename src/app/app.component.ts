import { Component, ElementRef, NgModule, NgZone, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { FormControl, FormsModule } from "@angular/forms";

import { MouseEvent, MapsAPILoader, AgmPolygon } from '@agm/core';
import {} from '@types/googlemaps';

import { ElevationService } from './elevation.service';

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

export class AppComponent implements OnInit,AfterViewInit{

  // google maps zoom level
  zoom: number;
  
  // initial center position for the map
  lat: number;
  lng: number;
  type: string;
  height: number;
  marker: marker;
  public searchControl: FormControl;

  // set paths
  selectedArea = [];
  
  // @ViewChild("search")
  // public searchElementRef: ElementRef;

  // @ViewChild(AgmPolygon)
  // selected:AgmPolygon;
  

  constructor(
    private elevation: ElevationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
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
    console.log(this.selectedArea);

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
  
  ngAfterViewInit(){}

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
    this.selectedArea = [];
    this.setNewPaths(this.marker.lat, this.marker.lng);
    let lot1 = new google.maps.LatLng($event.coords.lat, $event.coords.lng);
    let testing = [lot1];               
    this.getElevation(testing);
  }

  getElevation (arr) {
    this.elevation.getData(arr).subscribe(resp => {
      let dataSet = resp.results;
      console.log(dataSet);
    })
  }


}
