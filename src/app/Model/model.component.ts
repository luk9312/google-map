import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ModelService } from './model.service';
import * as THREE from 'three';
window['THREE'] = THREE;
import 'three/examples/js/controls/OrbitControls';

@Component({
  selector: 'geometry-cube',
  templateUrl: 'model.component.html',
  styleUrls: ['model.component.css']
})
export class ModelComponent implements OnInit{

  private container : HTMLElement;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;  

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.OrbitControls;

  private plane : THREE.Mesh;

  constructor(
    private modelService :ModelService
  ){
    console.log(THREE);

  }
  
  ngOnInit(){
    
    console.log(this.canvas);

    this.setScene();
    this.setMap();
    this.setRenderer();
  }

  setRenderer(){
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    console.log('canvas',this.canvas.clientWidth)
    document.body.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.25;
    this.controls.minDistance = 100;
    this.controls.maxDistance = 500
    this.controls.maxPolarAngle = Math.PI / 2;
    
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
      aspect : screen.width / screen.height,
      near   : 1,
      far    : 10000
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(view.angle, view.aspect, view. near, view.far);
    this.scene.add(new THREE.AxesHelper(50));
    this.camera.position.set(1500,1500,1500);
    // this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene.add(this.camera);

  }

  setMap(){
    let data:number[] =  this.modelService.elevationDataSet;
    let geometry = new THREE.PlaneGeometry(1000,1000, 199, 199);
    console.log('geo',geometry.vertices[0].z);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      geometry.vertices[i].z = data[i] / 100;
    }
    let material = new THREE.MeshBasicMaterial({ color : 0xFFFFFF, wireframe: true });
    console.log('geo',geometry.vertices[0].z);
    this.plane = new THREE.Mesh( geometry, material );
    this.plane.position.set(0,0,0);
    this.scene.add(this.plane);
  }
}