import { Component, AfterContentInit, OnInit } from '@angular/core';
import { ModelService } from '../Model/model.service';
import * as d3 from "d3";

@Component({
  selector: 'heatmap',
  styleUrls: ['heatmap.component.css'],
  templateUrl: 'heatmap.component.html'
})
export class HeatmapComponent implements OnInit,AfterContentInit {
  
  i0;
  i1;
  color;
  canvas;
  context;

  constructor(
    private modelService:ModelService
  ) {}

  ngOnInit() {
    this.i0 = d3.interpolate(d3.cubehelix(66.7, 0.23, 0), d3.cubehelix(66.7, 0.23, 1));
    // this.i1 = d3.interpolate(d3.cubehelix(60, 1, 0.90), d3.cubehelix(0, 0, 0.95));
    this.color = d3.scaleSequential(this.interpolateTerrain).domain([-1000, 5000]);
    this.canvas = d3.select("canvas")
        .attr("width", 1000)
        .attr("height", 1000);
    this.context = this.canvas.node().getContext("2d")
  }

  ngAfterContentInit() {

    d3.select("p").style("color", "red");

    
    let n = 200,
        m = 200;
  
    
  
    let image = this.context.createImageData(n, m);
  
    for (let j = 0, k = 0, l = 0; j < m; ++j) {
      for (let i = 0; i < n; ++i, ++k, l += 4) {
        let c = d3.rgb(this.color(this.modelService.elevationDataSet[k]));
        image.data[l + 0] = c.r;
        image.data[l + 1] = c.g;
        image.data[l + 2] = c.b;
        image.data[l + 3] = 255;
      }
    }
  
    this.context.putImageData(this.scaleImageData(image,5), 0, 0);


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