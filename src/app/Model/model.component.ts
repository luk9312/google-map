import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import * as THREE from 'three';

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

  private plane : THREE.Mesh;

  constructor(){
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
      angle  : 45,
      aspect : screen.width / screen.height,
      near   : 1,
      far    : 1000
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(view.angle, view.aspect, view. near, view.far);
    this.scene.add(new THREE.AxesHelper(50));
    this.camera.position.set(60,100,100);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
    this.scene.add(this.camera);
  }

  setMap(){
    let data:number[] =  [1397, 1455, 1493, 1525, 1495, 1464, 1464, 1465, 1471, 1482, 
                          1514, 1535, 1521, 1488, 1401, 1300, 1223, 1191, 1262, 1414,
                          1497, 1457, 1494, 1727, 1497, 1454, 1454, 1457, 1471, 1482, 
                          1714, 1747, 1721, 1488, 1401, 1400, 1284, 1191, 1858, 1414,
                          1497, 1477, 1494, 1787, 1497, 1454, 1454, 1457, 1471, 1488, 
                          1714, 1747, 1721, 1488, 1401, 1400, 1224, 1191, 1252, 1414,
                          1497, 1477, 1494, 1727, 1487, 1464, 1464, 1467, 1471, 1482, 
                          1714, 1767, 1721, 1688, 1601, 1600, 1226, 1181, 1262, 1614,
                          1487, 1477, 1484, 1727, 1497, 1464, 1363, 1367, 1371, 1382, 
                          1713, 1737, 1721, 1488, 1401, 1400, 1224, 1191, 1262, 1414,];
    let geometry = new THREE.PlaneGeometry(60, 60, 9, 9);
    console.log('geo',geometry.vertices[0].z);
    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
      geometry.vertices[i].z = data[i] / 6553 * 60;
    }
    let material = new THREE.MeshBasicMaterial({ color : 0xFFFFFF, wireframe: true });
    console.log('geo',geometry.vertices[0].z);
    this.plane = new THREE.Mesh( geometry, material );
    this.plane.position.set(0,0,0);
    this.plane.rotateX(90);
    this.scene.add(this.plane);
  }
}