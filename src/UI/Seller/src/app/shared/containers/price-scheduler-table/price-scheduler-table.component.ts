import { Component, OnInit } from '@angular/core';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { PriceSchedule } from '@ordercloud/angular-sdk';

import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { OcPriceScheduleService } from '@ordercloud/angular-sdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-price-scheduler-table',
  templateUrl: './price-scheduler-table.component.html',
  styleUrls: ['./price-scheduler-table.component.scss']
})
export class PriceSchedulerTableComponent extends BaseBrowse implements OnInit {

  columns = ['ID', 'Name', 'MaxQuantity', 'MinQuantity', 'Delete'];
  priceScheduler: any
  faTrash = faTrashAlt;
  faPlusCircle = faPlusCircle;
  modalID = 'NewPriceSchedulerModal';
  editModalID = 'EditPriceSchedulerModal';

  selectedPriceSchedule: PriceSchedule;

  constructor(
    private ocPriceScheduleService: OcPriceScheduleService,
    private modalService: ModalService,
    private toasterService: ToastrService
  ) {
    super()
  }

  ngOnInit() {
    this.loadData();
  }


  loadData() {
    this.ocPriceScheduleService.List().subscribe((res) => {
      console.log("PST : ", res);
      this.priceScheduler = res;
    });
  }

  openNewPriceSchedulertModal() {
    this.modalService.open(this.modalID);
  }


  addPriceSchedule(priceSchedule: PriceSchedule) {

    this.modalService.close(this.modalID);
    this.ocPriceScheduleService.Create(priceSchedule).subscribe(() => {
      this.loadData();
    });
  }

  deletePriceScheduler(priceSchedulerID) {
    console.log(priceSchedulerID)
    this.ocPriceScheduleService.Delete(priceSchedulerID).subscribe((res) => {
      this.toasterService.error('Succesfully', 'Price Schedule Deleted');
      this.loadData();
    });
  }

  editPriceSchedule(priceSchedule1: PriceSchedule, prevID: string) {
    this.modalService.close(this.editModalID);
    this.ocPriceScheduleService.Patch(prevID, priceSchedule1).subscribe(() => {
      this.loadData();
    });
  }

  openEditModal(priceSchedule1: PriceSchedule) {
    this.selectedPriceSchedule = priceSchedule1;
    this.modalService.open(this.editModalID);
  }
}
