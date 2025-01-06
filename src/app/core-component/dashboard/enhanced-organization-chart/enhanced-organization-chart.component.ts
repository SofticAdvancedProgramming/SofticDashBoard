import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import OrgChart from "@balkangraph/orgchart.js";
import { OrganizationChartService } from '../../../services/organizationChartService/organization-chart.service';
import { OrganizationChartModel } from '../../../core/models/OrganizationChart';

@Component({
  selector: 'app-enhanced-organization-chart',
  templateUrl: './enhanced-organization-chart.component.html',
  styleUrls: ['./enhanced-organization-chart.component.css'],
  standalone:true,
  
})
export class EnhancedOrganizationChartComponent implements OnInit ,AfterViewInit{
  private updatedX = 125;  // Store the updated x value
  private updatedY = 50;   // Store the updated y value
  constructor(
    private organizationChartService: OrganizationChartService,
    private cdr: ChangeDetectorRef ,// Inject ChangeDetectorRef,
    private el: ElementRef, private renderer: Renderer2
  ) {}
  ngAfterViewInit() {
    // Use MutationObserver to monitor changes to the DOM
    const observer = new MutationObserver(() => {
      this.updateTspanAttributes();
    });

    observer.observe(this.el.nativeElement, {
      attributes: true, // Monitor attribute changes
      childList: true,  // Monitor additions/removals
      subtree: true,    // Include all descendants
    });

    // Initial update
    this.updateTspanAttributes();
  }

  updateTspanAttributes() {
    // Find the <tspan> element
    const tspanElements = this.el.nativeElement.querySelectorAll('tspan[x="230"][y="30"]');
 
    if (tspanElements.length>0) {
     
      for(let i=0;i<tspanElements.length;i++)
      {
        this.renderer.setAttribute(tspanElements[i], 'x', this.updatedX.toString());
        this.renderer.setAttribute(tspanElements[i], 'y', this.updatedY.toString());
        this.renderer.setAttribute(tspanElements[i],'font-size', '20px');
        this.renderer.setAttribute(tspanElements[i],"text-anchor","middle")
        this.renderer.setAttribute(tspanElements[i],"font-weight","bold")
      }
     
    }
  }
  ngOnInit() {
    const companyId = Number(localStorage.getItem("companyId"));
    let orgChartData: OrganizationChartModel[] = [];
    OrgChart.LINK_ROUNDED_CORNERS = 20;
    OrgChart.templates['mila'].link = '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />';

    this.organizationChartService.getAllOrganizationChart({isDelete:false, companyId,pageSize:10000 }).subscribe({
      next: (orgData) => {
     console.log("dataaaaaaaaaa",orgData)
        for (let item of orgData.data.list) {

          orgChartData.push({
            // companyId: item.companyId,
            //entityId: item.entityId,
            id: item.entityId,
            pid: item.parentId,
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
        filterBy:['name','title'],
        tags: {
          filter: {
              template: 'dot'
          }
      },
        template: 'mila',
        showXScroll:true,
        showYScroll:true
      });

      chart.filterUI.on('add-filter', function(sender, args){
        var names = Object.keys(sender.filterBy);
        var index = names.indexOf(args.name);
        if (index == names.length - 1) {
            args.html += `<div data-btn-reset style="color: #039BE5;">reset</div>`;
        }  
    });
    
    chart.filterUI.on('add-item', function(sender:any, args){
        var count = 0;
        var totalCount = 0;
        for (var i = 0; i < sender.instance.config.nodes.length; i++){
            var data = sender.instance.config.nodes[i];      
            if (data[args.name] != undefined){
                totalCount++;
    
                if (data[args.name] == args.value){            
                    count++;    
                }            
            }
        }
    
        var dataAllAttr = '';
        if (args.text == '[All]'){
            count = totalCount;
            dataAllAttr = 'data-all';
        }
        args.html = `<div class="filter-item">
                        <input ${dataAllAttr} type="checkbox" id="${args.value}" name="${args.value}" ${args.checked ? 'checked' : ''}>
                        <label for="${args.value}">${args.text} (${count})</label>
                    </div>`;
    });
    chart.filterUI.on('update', function(sender:any, args){
        var btnResetElement = sender.element.querySelector('[data-btn-reset]');
        btnResetElement.addEventListener('click', function(e:any){
            sender.filterBy = null;
            sender.update();
            sender.instance.draw();
        });
    });
    
    chart.filterUI.on('show-items', function(sender:any, args){
        var filterItemElements = sender.element.querySelectorAll('.filter-item');
        for(var i = 0; i < filterItemElements.length; i++){        
            filterItemElements[i].addEventListener('mouseenter', function(e:any){
                var val = e.target.querySelector('input').id;           
                if (val != args.name){//[All]
                    for(var j = 0; j < sender.instance.config.nodes.length; j++){
                        var data = sender.instance.config.nodes[j];
                        if (data[args.name] == val){
                            var nodeElement = sender.instance.getNodeElement(data.id);
                            nodeElement.classList.add('filter-item-hovered');
                        }
                    }
                }
            });
            
            filterItemElements[i].addEventListener('mouseleave', function(e:any){
                var val = e.target.querySelector('input').id;           
                if (val != args.name){//[All]
                    for(var j = 0; j < sender.instance.config.nodes.length; j++){
                        var data = sender.instance.config.nodes[j];
                        if (data[args.name] == val){
                            var nodeElement = sender.instance.getNodeElement(data.id);
                            nodeElement.classList.remove('filter-item-hovered');
                        }
                    }
                }
            });
        }
    });
    
    
    chart.onInit(function (this: OrgChart) {
      this.filterUI.show('title');
  });
    
      // Load chart with data
      chart.load(orgChartData);

  
      

      // Trigger change detection manually to ensure the DOM updates
      this.cdr.detectChanges(); // This forces Angular to update the view
    }
  }
}
