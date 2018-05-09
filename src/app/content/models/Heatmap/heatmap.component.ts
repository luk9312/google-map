import { Component, AfterContentInit, OnInit } from '@angular/core';
import { ElevationService } from '../../shared/service/elevation.service';
import * as d3 from "d3";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'heatmap',
  styleUrls: ['heatmap.component.css'],
  templateUrl: 'heatmap.component.html'
})
export class HeatmapComponent implements OnInit,AfterContentInit {
  private subscribe :Subscription;
  private data;
  private i0;
  private i1;
  private color;
  private canvas;
  private context;
  private contextShaded;
  private image;
  private projection = d3.geoAzimuthalEqualArea()
    .rotate([-8.2, -46.8])
    .translate([100, 100])
    .scale(12000);

  constructor(
    private elevationService:ElevationService
  ) {}

  ngOnInit() {
    // this.subscribe =  this.elevationService.data$.subscribe(
    //   data => this.data = data
    // );
    this.i0 = d3.interpolate(d3.cubehelix(99, 0.6, 0.45), d3.cubehelix(66.7, 0.23, 1));
    // this.i1 = d3.interpolate(d3.cubehelix(60, 1, 0.90), d3.cubehelix(0, 0, 0.95));
    this.color = d3.scaleSequential(this.interpolateTerrain).domain([-1000, 5000]);
    this.canvas = d3.select("canvas")
        .attr("width", 1000)
        .attr("height", 1000);
    this.context = this.canvas.node().getContext("2d")
    
    let canvasShaded = d3.select("body").append("canvas")
      .attr("width", 1000)
      .attr("height", 1000)
      .style("display","none");
    this.contextShaded = canvasShaded.node().getContext("2d");
  }

  ngAfterContentInit() {
    let n = 200,
        m = 200;
    // the color image
    this.image = this.context.createImageData(n, m);
  
    for (let j = 0, k = 0, l = 0; j < m; ++j) {
      for (let i = 0; i < n; ++i, ++k, l += 4) {
        let c = d3.rgb(this.color(this.data[k]));
        this.image.data[l + 0] = c.r;
        this.image.data[l + 1] = c.g;
        this.image.data[l + 2] = c.b;
        this.image.data[l + 3] = 255;
      }
    }
    this.image = this.scaleImageData(this.image,5)
  
    this.context.putImageData(this.image, 0, 0);

    // the shaded image
    // let idShaded = this.contextShaded.createImageData(n,m);
    // let posShaded = 0;
    // for(var j = 0; j<m; j++){
    //   for(var i = 0; i<n; i++){
    //     var pointCoords = this.projection.invert([i,j]);
    //     var px = invGeoTransform[0] + pointCoords[0]* invGeoTransform[1];
    //     var py = invGeoTransform[3] + pointCoords[1] * invGeoTransform[5];
  
    //     var shadedValue;
    //     if(Math.floor(px) >= 0 && Math.ceil(px) < image.getWidth() && Math.floor(py) >= 0 && Math.ceil(py) < image.getHeight()){
    //       shadedValue = 255*(1+shadedData[Math.floor(py)][Math.floor(px)])/2;
  
    //     } else {
    //       shadedValue = 255;
    //     }
    //     dataShaded[posShaded]   = shadedValue;
    //     dataShaded[posShaded+1]   = shadedValue;
    //     dataShaded[posShaded+2]   = shadedValue;
    //     dataShaded[posShaded+3]   = 255 - shadedValue;
  
    //     posShaded=posShaded+4;
    //   }
    // }

  }

  scaleImageData(imageData, scale) {
    var scaled = this.context.createImageData(imageData.width * scale, imageData.height * scale);
  
    for(var row = 0; row < imageData.height; row++) {
      for(var col = 0; col < imageData.width; col++) {
        var sourcePixel = [
          imageData.data[(row * imageData.width + col) * 4 + 0],
          imageData.data[(row * imageData.width + col) * 4 + 1],
          imageData.data[(row * imageData.width + col) * 4 + 2],
          imageData.data[(row * imageData.width + col) * 4 + 3]
        ];
        for(var y = 0; y < scale; y++) {
          var destRow = row * scale + y;
          for(var x = 0; x < scale; x++) {
            var destCol = col * scale + x;
            for(var i = 0; i < 4; i++) {
              scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
                sourcePixel[i];
            }
          }
        }
      }
    }
  
    return scaled;
  }
  

  interpolateTerrain = (t) => this.i0(t * 2);
  // interpolateTerrain = (t) => t < 0.5 ? this.i0(t * 2) : this.i1((t - 0.5) * 2); 

}