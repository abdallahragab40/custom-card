import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppBridgeService } from '../../tools/service/app-bridge.service';

@Component({
  selector: 'platform-opportunity-card',
  templateUrl: './opportunity-card.component.html',
  styleUrls: ['./opportunity-card.component.scss'],
})
export class OpportunityCardComponent implements OnInit {
  public corporationId: any;
  public userId: any;
  public res: any;
  public parsedLinks: any = [];
  public bridge: any;

  constructor(private appBridgeService: AppBridgeService, private route: ActivatedRoute) {
    this.corporationId = this.route.snapshot.queryParamMap.get('EntityID');
    console.log('corporationId ', this.corporationId);
  }

  async ngOnInit() {
    this.getOpportunities(this.corporationId).then(async (res) => {
      this.res = res;
      console.log('res', this.res);
      const parsedData = await this.parseOpportunityData(res);
      this.parsedLinks = parsedData;
      console.log('parsedLinks', this.parsedLinks);

      return res;
    });
  }

  public getOpportunities(clientCorporationId): Promise<any> {
    const url = `query/Opportunity?where=clientCorporation.id=${clientCorporationId}and status in ('Closed-Lost' , 'Closed-Won') &fields=*&count=300`;
    return this.appBridgeService
      .promise()
      .then((bridge) => {
        return bridge.httpGET(url);
      })
      .then((response) => {
        console.log('response: ', response.data.data);
        return Promise.resolve(response.data.data);
      });
  }
  public formatDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  public async parseOpportunityData(data): Promise<any> {
    this.bridge = await this.appBridgeService.promise();

    const newData = data.map((opportunity) => {
      return {
        id: opportunity.id,
        name: ' | ' + opportunity.customTextBlock1,
        owner: opportunity.owner.firstName + ' ' + opportunity.owner.lastName,
        status: opportunity.status,
        expectedCloseDate: this.formatDate(new Date(opportunity.expectedCloseDate)),
        personSubtype: 'Opportunity',
        link: () => {
          this.bridge.open({
            type: 'record',
            entityType: 'Opportunity',
            entityId: opportunity.id,
          });
        },
      };
    });
    console.log('newData', newData);
    return newData;
  }
}
