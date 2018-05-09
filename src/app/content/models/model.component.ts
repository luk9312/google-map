import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ElevationService } from '../shared/service/elevation.service';
import * as THREE from 'three';
window['THREE'] = THREE;
import 'three/examples/js/controls/OrbitControls';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'geometry-cube',
  templateUrl: 'model.component.html',
  styleUrls: ['model.component.css']
})
export class ModelComponent implements OnInit, AfterViewInit, OnDestroy{

  private container : HTMLElement;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  @ViewChild('heatmap')
  private maplayer;

  private image;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.OrbitControls;

  private plane : THREE.Mesh;
  private subscribe :Subscription;
  private data = [];

  constructor(
    private elevationService :ElevationService
  ){

  }
  
  ngOnInit(){
    this.subscribe =  this.elevationService.data$.subscribe(
      data => {
        this.data = data.map(point => point.elevation);;
      }
    );
  }

  ngAfterViewInit() {
    this.image = this.maplayer.image;
    this.setScene();
    this.setMap();
    this.setRenderer();

  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  setRenderer(){
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    this.controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 5000
    this.controls.maxAzimuthAngle = Math.PI;
    
    this.render();
  }

  render(){

    let self: ModelComponent = this;
    
    (function render(){
      requestAnimationFrame(render);
      self.animate();
      self.renderer.render(self.scene, self.camera);
    }());
    
  }

  animate(){
    // this.plane.rotateX(0.1);
    // this.plane.rotateY(0.01);
    // this.plane.position.addScalar(0.2);

  }

  setScene(){
    let screen = {
      width  : 300,
      height : 300
    };

    let view = {
      angle  : 50,
      aspect : (window.innerWidth / 2)/window.innerHeight,
      near   : 0.1,
      far    : 10000
    };

    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(view.angle, view.aspect, view. near, view.far);
    this.scene.add(new THREE.AxesHelper(500));
    // this.scene.add(new THREE.AmbientLight(0xeeeeee));
    this.camera.position.set(20, -80, 100);
    // this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene.add(this.camera);

  }

  setMap(){
    console.log('elevation data', this.data);
    let geometry = new THREE.PlaneGeometry(1000,1000, 199, 199);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      geometry.vertices[i].z = this.data[i]/50 ;
    }
    let texture = new THREE.Texture(this.image);
    texture.needsUpdate = true;
    let material = new THREE.MeshBasicMaterial({ map: texture });
    this.plane = new THREE.Mesh( geometry, material );
    this.plane.position.set(0,0,0);
    this.scene.add(this.plane);
  }
}