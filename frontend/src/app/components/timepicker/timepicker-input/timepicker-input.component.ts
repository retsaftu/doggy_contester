import {FocusMonitor} from '@angular/cdk/a11y';
import { Time } from 'src/app/entities/contester.entity';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';

export function timeValidator(timeValidatorType: TimeValidatorType): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(timeValidatorType == TimeValidatorType.HOURS) {
      const hours = parseInt(control.value);
      // console.log(`hours ${hours}`)
      return hours >= 0 && hours <= 23 ? null : {hours: {value: control.value}};
    } else if(timeValidatorType == TimeValidatorType.MINUTES) {
      const minutes = parseInt(control.value);
      // console.log(`minutes ${minutes}`);
      return minutes >= 0 && minutes <= 59 ? null : {minutes: {value: control.value}};
    }
    return {error: {value: control.value}}
  };
}

enum TimeValidatorType {
  MINUTES = "minutes",
  HOURS = "hours"
}

@Component({
  selector: 'app-timepicker-input',
  templateUrl: './timepicker-input.component.html',
  styleUrls: ['./timepicker-input.component.css'],
  providers: [{provide: MatFormFieldControl, useExisting: TimepickerInputComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
})
export class TimepickerInputComponent implements ControlValueAccessor, MatFormFieldControl<Time>, OnDestroy {
  static nextId = 0;
  @ViewChild('hours') hoursInput!: HTMLInputElement;
  @ViewChild('minutes') minutesInput!: HTMLInputElement;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'app-timepicker-input';
  id = `app-timepicker-input-${TimepickerInputComponent.nextId++}`;
  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {
      value: {hours, minutes},
    } = this.parts;

    return !hours && !minutes;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy?: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string = '';

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): Time | null {
    if (this.parts.valid) {
      const {
        value: {hours, minutes},
      } = this.parts;
      return new Time(hours, minutes);
    }
    return null;
  }
  set value(time: Time | null) {
    const {hours, minutes} = time || new Time('00', '00');
    this.parts.setValue({hours, minutes});
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return this.parts.invalid && this.touched;
  }

  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    this.parts = formBuilder.group({
      hours: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2), timeValidator(TimeValidatorType.HOURS)]],
      minutes: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2), timeValidator(TimeValidatorType.MINUTES )]],
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector(
      '.example-tel-input-container',
    )!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {
    if (this.parts.controls['hours'].valid) {
      this._focusMonitor.focusVia(this.minutesInput, 'program');
    } else {
      this._focusMonitor.focusVia(this.hoursInput, 'program');
    }
  }

  writeValue(time: Time | null): void {
    this.value = time;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

}
