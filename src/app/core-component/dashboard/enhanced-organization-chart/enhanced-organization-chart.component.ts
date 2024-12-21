import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import {TreeNode} from 'primeng/api';
import OrgChart from "@balkangraph/orgchart.js";
import { OrganizationChartService } from '../../../services/organizationChartService/organization-chart.service';

@Component({
  selector: 'app-enhanced-organization-chart',
  standalone: true,
  imports: [OrganizationChartModule],
  templateUrl: './enhanced-organization-chart.component.html',
  styleUrls: ['./enhanced-organization-chart.component.css'],
})
export class EnhancedOrganizationChartComponent implements OnInit{

 constructor(private organizationChartService:OrganizationChartService)
 {

 }

  ngOnInit() {
  var companyId= Number(localStorage.getItem("companyId"));
    this.organizationChartService.getAllOrganizationChart({companyId}).subscribe({
        next:orgData=>{
            console.log("orgData",orgData)
        }
    })
   

    const tree = document.getElementById('tree');
    if (tree) {
        var chart = new OrgChart(tree, {

          menu: {
            pdf: { text: "Export PDF" },
            png: { text: "Export PNG" },
        },
        nodeMenu: {
            pdf: { text: "Export PDF" },
            png: { text: "Export PNG" },
        },
        showYScroll:true,
        showXScroll:true,
            nodeBinding: {
            field_0: "name",
            field_1:"title",
            },
            template:'mery',
        });

         chart.load([
            { id: 1, name: "Otishan Company", title: "Otishan", img: "https://cdn.balkan.app/shared/2.jpg" },
            { id: 2, pid: 1, name: "Cairo Branch", title: "Branch", img: "https://cdn.balkan.app/shared/3.jpg" },
            { id: 3, pid: 1, name: "Suadi Branch", title: "Branch", img: "https://cdn.balkan.app/shared/4.jpg" },
            { id: 4, pid: 2, name: "IT Department", title: "Department", img: "https://cdn.balkan.app/shared/5.jpg" },
            { id: 5, pid: 2, name: "Hr department", title: "Department", img: "https://cdn.balkan.app/shared/6.jpg" },
            { id: 6, pid: 3, name: "Sales Department", title: "Department", img: "https://cdn.balkan.app/shared/7.jpg" },
            { id: 7, pid: 3, name: "Finance Department", title: "Department", img: "https://cdn.balkan.app/shared/8.jpg" },

            { id: 8, pid: 4, name: "Full Stack", title: "Position", img: "https://cdn.balkan.app/shared/8.jpg" },
            { id: 9, pid: 4, name: "Mobile", title: "Position", img: "https://cdn.balkan.app/shared/8.jpg" },

            { id: 10, pid: 8, name: "Abanoub Nabil", title: "Employee", img: "https://cdn.balkan.app/shared/8.jpg" },
            { id: 11, pid: 10, name: "Mayar Mahmoud", title: "Employee", img: "https://cdn.balkan.app/shared/8.jpg" },

            { id: 12, pid: 9, name: "Mostafa abdelatif", title: "Employee", img: "https://cdn.balkan.app/shared/7.jpg" },
            { id: 13, pid: 12, name: "Hager alsayed", title: "Employee", img: "https://cdn.balkan.app/shared/8.jpg" },
            { id: 14, pid: 12, name: "Asmall Shoaib", title: "Employee", img: "https://cdn.balkan.app/shared/8.jpg" },


        ]);
        
    }
   
}
}
