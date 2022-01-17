import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { RegexService } from '@app-seller/shared/services/regex/regex.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { OcUserGroupService } from '@ordercloud/angular-sdk';


@Component({
  selector: 'app-announcement-form',
  templateUrl: './announcement-form.component.html',
  styleUrls: ['./announcement-form.component.scss'],
})
export class AnnouncementFormComponent implements OnInit {
  private _existingAnnouncement: any = {};
  @Input()
  btnText: string;

  @Output()
  formSubmitted = new EventEmitter();
  announcementForm: FormGroup;
  existingId: string = '';
  cDate: any;

  dropdownList = [];
  selectedItems = [];

  dropdownSettings: IDropdownSettings;
  userGroups: any
  selectedGroups = []



  _existingAnnoucement: any;
  constructor(

    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService,
    private toasterService: ToastrService,
    private ocUserGroupService: OcUserGroupService,
  ) {

  }

  ngOnInit() {
    this.cDate = new Date().toISOString().slice(0, 10);
    this.setForm();

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.ocUserGroupService.List("BUYER_ORGANIZATION").subscribe(res => {

      this.userGroups = res.Items;
      this.userGroups.forEach(element => {

      });

    })
  }
  @Input()
  set existingAnnouncement(annoucement: any) {
    this._existingAnnoucement = annoucement || {};

    this.existingId = this._existingAnnoucement.ID;
    if (!this.announcementForm) {
      this.setForm();

      return;
    }
    this.announcementForm.setValue({
      Title: this._existingAnnoucement.Title || '',
      Order: this._existingAnnoucement.Order || '',
      StartDate: this._existingAnnoucement.StartDate || '',
      EndDate: this._existingAnnoucement.EndDate || '',
    });
    this.selectedItems = this._existingAnnoucement.userGroups

  }
  setForm() {
    this.announcementForm = this.formBuilder.group({
      Title: [
        this._existingAnnouncement.title || '',
        [Validators.required, Validators.pattern(this.regexService.ObjectName)],
      ],
      Order: [this._existingAnnouncement.order || '', [Validators.required]],
      StartDate: [
        this._existingAnnouncement.StartDate || '',
        [Validators.required],
      ],
      EndDate: [
        this._existingAnnouncement.EndDate || '',
        [Validators.required],
      ],
    });

  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  protected onSubmit() {
    if (this.announcementForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.announcementForm);
    }

    let startDate = new Date(this.announcementForm.value.StartDate);
    let endDate = new Date(this.announcementForm.value.EndDate);
    if (startDate > endDate) {
      return this.toasterService.error(
        'StartDate Should not be Greater than EndDate'
      );
    }

    if (this.existingId == '') {
      var id = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = id + Date.now();
      const announcement = {
        ...this.announcementForm.value,
        ID: uniqid,
        userGroups: this.selectedItems
      };

      this.formSubmitted.emit(announcement);
    } else {
      const announcement = {
        ...this.announcementForm.value,
        ID: this.existingId,
        userGroups: this.selectedItems
      };

      this.formSubmitted.emit(announcement);

    }
  }

  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.announcementForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.announcementForm);
}
