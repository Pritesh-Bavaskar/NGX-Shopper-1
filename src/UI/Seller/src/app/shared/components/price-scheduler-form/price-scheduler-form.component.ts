import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PriceSchedule } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { RegexService } from '@app-seller/shared/services/regex/regex.service';

@Component({
  selector: 'app-price-scheduler-form',
  templateUrl: './price-scheduler-form.component.html',
  styleUrls: ['./price-scheduler-form.component.scss'],
})
export class PriceSchedulerFormComponent implements OnInit {
  private _existingPriceSchedule: PriceSchedule = {};
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter<{ priceSchedule: PriceSchedule, prevID: string }>();
  priceScheduleForm: FormGroup;
  totalRows: number;


  PriceBreaks: any


  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService
  ) { }

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingPriceSchedule(priceSchedule: PriceSchedule) {
    this._existingPriceSchedule = priceSchedule || {};
    // if (!this.priceScheduleForm) {
    this.setForm();
    //   return;
    // }

    // this.priceScheduleForm.setValue({
    //   ID: this._existingPriceSchedule.ID || '',
    //   Name: this._existingPriceSchedule.Name || '',
    //   MinQuantity: this._existingPriceSchedule.MinQuantity || '',
    //   MaxQuantity: this._existingPriceSchedule.MaxQuantity || '',
    //   ApplyTax: !!this._existingPriceSchedule.MaxQuantity || '',
    //   ApplyShipping: !!this._existingPriceSchedule.MaxQuantity || '',
    //   UseCumulativeQuantity: !!this._existingPriceSchedule.UseCumulativeQuantity || '',
    //   RestrictedQuantity: !!this._existingPriceSchedule.RestrictedQuantity || '',
    //   Desc: this._existingPriceSchedule.xp && this._existingPriceSchedule.xp.Desc || '',

    // })

  }

  setForm() {
    this.priceScheduleForm = this.formBuilder.group({
      ID: [
        this._existingPriceSchedule.ID || '',
        Validators.pattern(this.regexService.ID),
      ],
      Name: [
        this._existingPriceSchedule.Name || '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      MinQuantity: [this._existingPriceSchedule.MinQuantity || ''],
      MaxQuantity: [this._existingPriceSchedule.MaxQuantity || ''],
      ApplyTax: [!!this._existingPriceSchedule.ApplyTax],
      ApplyShipping: [!!this._existingPriceSchedule.ApplyShipping],
      UseCumulativeQuantity: [!!this._existingPriceSchedule.UseCumulativeQuantity],
      RestrictedQuantity: [!!this._existingPriceSchedule.RestrictedQuantity],
      Desc: [this._existingPriceSchedule.xp && this._existingPriceSchedule.xp.Desc],

      PriceBreaks: new FormArray([])
    });
    const fa = (this.priceScheduleForm.get('PriceBreaks') as FormArray)
    if (this._existingPriceSchedule && this._existingPriceSchedule.PriceBreaks) {
      this.setExistingPriceSchedule();
    }
  }

  setExistingPriceSchedule() {
    this.PriceBreaks = this.priceScheduleForm.get('PriceBreaks') as FormArray;
    this._existingPriceSchedule.PriceBreaks.forEach((element) => {
      this.PriceBreaks.push(this.formBuilder.group({
        Quantity: [element.Quantity, Validators.required],
        Price: [element.Price, Validators.required]
      }));

    });
  }

  deleteRow(index: number) {
    const control = (this.priceScheduleForm.get('PriceBreaks') as FormArray)
    control.removeAt(index)
  }

  AddPriceBreakRow() {
    const fa = (this.priceScheduleForm.get('PriceBreaks') as FormArray)
    fa.push(this.formBuilder.group({
      Price: ['', Validators.required],
      Quantity: ['', Validators.required],
    }));

  }



  protected onSubmit() {
    if (this.priceScheduleForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.priceScheduleForm);
    }
    let priceScheduleNew;
    console.log("", this.priceScheduleForm.value)

    priceScheduleNew = {
      ...this.priceScheduleForm.value,
      xp: { Desc: this.priceScheduleForm.value.Desc }

    };

    console.log("PSNew: ", priceScheduleNew)
    this.formSubmitted.emit({
      priceSchedule: priceScheduleNew,
      prevID: this.priceScheduleForm.value.ID
    });
  }

  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.priceScheduleForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.priceScheduleForm);
}
