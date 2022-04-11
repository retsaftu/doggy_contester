import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css']
})
export class InputNumberComponent implements OnInit {

  @Input() min = 0;
  @Input() max?: number;

  @Input() cycle = false;

  @Input() formatValue = true;

  @Output() changeValueEvent = new EventEmitter<Number>();

  @Input() value = this.min;
  valueStr = this.getFormatedValue(this.value);

  constructor() { }

  ngOnInit(): void {
    // console.log(this.value)
    this.valueStr = this.getFormatedValue(this.value);
  }

  increment() {
    if(!this.max || this.value < this.max) {
      this.value++;
    } else if(this.value == this.max && this.cycle) {
      this.value = this.min;
    }
    this.valueStr = this.getFormatedValue(this.value);
    this.changeValueEvent.emit(this.value);
  }

  check(event: any) {
    let value = parseInt(event.target.value);
    if(value < this.min) {
      event.target.value = this.min.toString();
      this.value = this.min;
    }
    else if(!!this.max && value > this.max) {
      event.target.value = this.max.toString();
      this.value = this.max;
    } else if(!!value) {
      this.value = value;
    } else {
      event.target.value = this.min.toString();
      this.value = this.min;
    }
    this.valueStr = this.getFormatedValue(this.value);
    this.changeValueEvent.emit(this.value);
  }

  decrement() {
    if(this.value < this.min) {
      this.value --;
    } else if(!!this.max && this.value == this.min && this.cycle) {
      this.value = this.max;
    }
    this.valueStr = this.getFormatedValue(this.value);
    this.changeValueEvent.emit(this.value);
  }

  getFormatedValue(value: number):string {
    if(!this.formatValue) {
      return value.toString();
    }
    if(value < 10) {
      return "0" + value.toString();
    }
    return value.toString();
  }

}
