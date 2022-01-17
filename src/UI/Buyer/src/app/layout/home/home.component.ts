import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  OcMeService,
  ListBuyerProduct,
  OcBuyerService,
  Buyer,
  OcUserGroupService,
} from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'layout-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredProducts$: Observable<ListBuyerProduct>;
  buyerOrg$: Observable<Buyer>;
  buyerOrgArr: any = []
  sortedbuyerOrgArr: any = []
  sortedAnnouncements: any
  assignedIDs: any = []
  userID: any

  sample: any
  faBullhorn = faBullhorn;

  constructor(
    private config: NgbCarouselConfig,
    private ocMeService: OcMeService,
    private ocBuyerService: OcBuyerService,
    private ocUserGroupService: OcUserGroupService,
  ) { }

  ngOnInit() {
    this.config.interval = 5000;
    this.config.wrap = true;
    this.featuredProducts$ = this.ocMeService.ListProducts({
      filters: <any>{ 'xp.Featured': true },
    });

    this.sortedAnnouncementList();

    setTimeout(() => {
      this.buyerOrg$ = this.GetBuyerOrg();
      // console.log("buyerorgarr 2", this.buyerOrgArr)
    }, 2000)

  }

  GetBuyerOrg(): Observable<Buyer> {
    // In a buyer context, listing buyers will return only one buyer organization, your own.
    return this.ocBuyerService.List().pipe(map((list) => list.Items[0]));
  }

  getUserAssignment() {
    return this.ocUserGroupService.ListUserAssignments("BUYER_ORGANIZATION", {
      userID: this.userID,
    });
  }

  sortedAnnouncementList() {

    this.GetBuyerOrg().subscribe(res => {
      let currentDate = new Date();
      this.buyerOrgArr = res.xp.Announcement
      // console.log("buyerorgarr 1", this.buyerOrgArr)
      // console.log("date: ", currentDate)
      this.assignedIDs = [];

      let announcementArray = [];

      this.buyerOrgArr.forEach(res => {

        let startDate = new Date(res.StartDate)
        let endDate = new Date(res.EndDate)

        if (currentDate >= startDate && currentDate <= endDate) {
          announcementArray.push(res)
        }
      })

      // console.log(announcementArray)
      this.sortedAnnouncements = announcementArray

      this.sortedAnnouncements.sort((s1, s2) => {
        return s1.Order - s2.Order;
      });
    })

  }

}
