import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';

import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'setting-form',
  styleUrls: ['setting-form.component.scss'],
  templateUrl: 'setting-form.component.html'
})
export class SettingFormComponent implements OnInit {

  @Input()
  modalActions:EventEmitter<string|MaterializeAction>;

  @Input()
  lengthValue:number;

  @Input()
  zoomValue:number;

  @Input()
  mapType:string;

  @Output()
  submitted = new EventEmitter<FormGroup>();

  selectOptions=[
    {name: 'roadmap', value: 'roadmap'},
    {name: 'hybrid', value: 'hybrid'},
    {name: 'satellite', value: 'satellite'},
    {name: 'terrain', value: 'terrain'}
  ]

  form = this.fb.group({
    length: ['', Validators.required],
    zoom: ['', Validators.required],
    type: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form.setValue({
      length: this.lengthValue,
      zoom: this.zoomValue,
      type: this.mapType
    });
  }


  onSubmit() {
    if (this.form.valid) {
      this.submitted.emit(this.form);
    }
  }

  get lengthInvalid() {
    const control = this.form.get('length');
    return control.hasError('required') && control.touched;
  }

  get zoomInvalid() {
    const control = this.form.get('zoom');
    return control.hasError('required') && control.touched;
  }

  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

}