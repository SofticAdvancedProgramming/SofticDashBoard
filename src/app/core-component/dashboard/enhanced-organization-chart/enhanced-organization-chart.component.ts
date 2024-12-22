import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import OrgChart from "@balkangraph/orgchart.js";
import { OrganizationChartService } from '../../../services/organizationChartService/organization-chart.service';
import { OrganizationChartModel } from '../../../core/models/OrganizationChart';

@Component({
  selector: 'app-enhanced-organization-chart',
  templateUrl: './enhanced-organization-chart.component.html',
  styleUrls: ['./enhanced-organization-chart.component.css'],
  standalone:true,
  
})
export class EnhancedOrganizationChartComponent implements OnInit {
  constructor(
    private organizationChartService: OrganizationChartService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    const companyId = Number(localStorage.getItem("companyId"));
    let orgChartData: OrganizationChartModel[] = [];

    this.organizationChartService.getAllOrganizationChart({ companyId,pageSize:10000 }).subscribe({
      next: (orgData) => {
        console.log("orgData.data.list",orgData.data.list)
        for (let item of orgData.data.list) {
          orgChartData.push({
            companyId: item.companyId,
            entityId: item.entityId,
            id: item.entityId,
            pid: item.partentId,
            name: item.title,
            nameArabic: item.titleAr,
            title: item.type,
          });
        }

        // After data is fetched, trigger chart rendering
        this.loadChart(orgChartData);
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }

  loadChart(orgChartData: OrganizationChartModel[]) {
    const tree = document.getElementById('tree');
    if (tree) {
      const chart = new OrgChart(tree, {
        menu: {
          pdf: { text: "Export PDF" },
          png: { text: "Export PNG" },
        },
        nodeMenu: {
          pdf: { text: "Export PDF" },
          png: { text: "Export PNG" },
        },
        nodeBinding: {
          field_0: "name",
          field_1: "title",
        },
        template: 'mila',
        showXScroll:true,
        showYScroll:true
      });

      // Load chart with data
      chart.load(orgChartData);

      // Trigger change detection manually to ensure the DOM updates
      this.cdr.detectChanges(); // This forces Angular to update the view
    }
  }
}
