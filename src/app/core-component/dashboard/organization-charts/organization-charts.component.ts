import { Component, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import * as go from 'gojs';
import { PositionService } from '../../../services/positionService/position.service';
import { PositionTypeService } from '../../../services/lockupsServices/positionTypeService/position-type.service';
import { DepartmentService } from '../../../services/lockupsServices/DepartmentService/department.service';
import { EmployeeService } from '../../../services/employeeService/employee.service'; // Import EmployeeService
import { Router } from '@angular/router';
import { employee } from '../../../../models/employee';
import { Position } from '../../../../models/positionModel';
import { Department } from '../../../../models/department';
import { MessageService } from 'primeng/api';
import { AssignEmployeesComponent } from '../employee/assign-employees/assign-employees.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-organization-chart',
  templateUrl: './organization-charts.component.html',
  styleUrls: ['./organization-charts.component.css'],
  providers: [],
  imports: [AssignEmployeesComponent, TranslateModule, FormsModule, CommonModule]
})
export class OrganizationChartsComponent implements AfterViewInit, OnChanges {
  @ViewChild('diagramDiv') diagramDiv!: ElementRef;
  isAddEmployee: boolean = false;
  selectedPositionId?: string;
  selectedPositionData: any = {};
  employees: employee[] = [];
  positions: Position[] = [];
  departments: Department[] = [];
  directManger?: employee = {} as employee;
  private positionTypesMap = new Map<number, string>();
  private departmentsMap = new Map<number, string>();
  private imageMap = new Map<number,string>();
  private employeeMap = new Map<number, string>();
companyId?:number=0
  constructor(
    private positionService: PositionService,
    private positionTypeService: PositionTypeService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private router: Router,
    private messageService: MessageService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // this.reloadComponent();
  }
  reloadComponent(){
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/',{
      skipLocationChange: true
    }).then(()=>{
      this.router.navigate([currentUrl])
    })
  }
  ngAfterViewInit(): void {
    this.loadPositionTypes();
    this.loadDepartments();
  this.companyId=Number(localStorage.getItem("companyId"))
  }

  loadPositionTypes(): void {
    this.positionTypeService.getPositionTypes().subscribe(response => {
      if (response.status === 200) {
        response.data.list.forEach((type: any) => {
          this.positionTypesMap.set(type.id, type.name);
        });
        this.loadEmployees();
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartment().subscribe(response => {
      if (response.status === 200) {
        response.data.list.forEach((dept: any) => {
          this.departments = response.data.list;
          this.departmentsMap.set(dept.id, dept.name);
        });
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.loadEmployees({companyId:this.companyId}).subscribe(response => {
      if (response.status === 200) {
        response.data.list.forEach((employee: any) => {
          console.log("employeeeeee",employee)
          this.employeeMap.set(employee.positionId, (employee.firstName+" "+employee.lastName));
          this.imageMap.set(employee.positionId,employee.referancePhoto);
        });
        this.loadPositions();
      }
    });
  }

  loadPositions(): void {
    this.positionService.getPosition({isDelete:false}).subscribe(response => {
      if (response.status === 200) {
        const nodeDataArray: any[] = [];
        const linkDataArray: any[] = [];
        this.positions = response.data.list;
        console.log(response);
        console.log("response.data",response.data)
        response.data.list.forEach((item: any) => {
          console.log("item",item)
          const { nodeDataArray: nodes, linkDataArray: links } = this.transformData([item]);
          console.log("nodeDataArray",nodeDataArray);
          console.log("linkDataArray",linkDataArray)

          nodeDataArray.push(...nodes);
          linkDataArray.push(...links);
        });

        this.initDiagram(nodeDataArray, linkDataArray);
      }
    });
  }

  transformData(data: any[]): { nodeDataArray: any[], linkDataArray: any[] } {
    const nodeMap = new Map<number, any>();
    const linkDataArray: any[] = [];

    const processNode = (data: any, parentId?: number) => {
      const nodeId = data.id;
      const positionTypeName = this.positionTypesMap.get(data.positionTypeId) || 'Unknown Position';
      const departmentName = this.departmentsMap.get(data.departmentId) || 'Unknown Department';
      const employeeName = this.employeeMap.get(nodeId) || 'Unassigned'; // Get the employee name
      const positionManagerId= data.positionManagerId;
      const image=this.imageMap.get(nodeId);

      nodeMap.set(nodeId, {
        key: nodeId,
        name: employeeName,
        title: positionTypeName,
        department: departmentName,
        id: data.id.toString(),
        image:image
      });

      if (positionManagerId &&positionManagerId!=null) {
        linkDataArray.push({ from: positionManagerId, to: nodeId });
      }

      if (data.subPositions && data.subPositions.length > 0) {
        data.subPositions.forEach((child: any) => processNode(child, nodeId));
      }
    };

    data.forEach(node => processNode(node));
    return { nodeDataArray: Array.from(nodeMap.values()), linkDataArray };
  }


  loadUnassignedEmployees(): void {
    this.employeeService.loadEmployees({ companyId: this.companyId, accountStatus: 1 }).subscribe({
      next: (response) => {
        console.log(response);
        this.employees = response.data.list.filter(
          (employee: any) => !employee.positionId
        );
        console.log("Unassigned Employees:", this.employees);
      }
    });
  }
  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === Number(positionId));
    this.loadUnassignedEmployees();
    this.isAddEmployee = true;
  }
  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department?.name ?? 'Unknown';
  }
  closePopup(): void {
    this.isAddEmployee = false;
  }
  handleFormSubmit(formData: { employeeId: number, positionId: number }): void {
    console.log("formData",formData)
    this.employeeService.assginEmployeeToPosition({
      employeeId: formData.employeeId,
      positionId: formData.positionId
    }).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee assigned successfully' });
        this.closePopup();
        this.loadPositions();
        this.loadUnassignedEmployees();
        this.reloadComponent();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error assigning employee' });
      }
    });
  }

  initDiagram(nodeDataArray: any[], linkDataArray: any[]) {
    console.log("nodeDataArray",nodeDataArray)
    console.log("linkDataArray",linkDataArray)

    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'undoManager.isEnabled': true,
      'layout': $(go.TreeLayout, { angle: 90, layerSpacing: 35 }),
      initialContentAlignment: go.Spot.Center,
      allowMove: false,
      allowResize: false,
      allowRotate: false,
    });

    diagram.nodeTemplate =
      $(go.Node, 'Auto',
        { margin: 10 },
        $(go.Shape, 'RoundedRectangle',
          {
            fill: '#FAF9FE',
            stroke: '#8413f8',
            strokeWidth: 1,
            width: 366,
            height: 153.05,
            cursor: 'pointer'
          }),
          
        $(go.Panel, 'Vertical',
          { margin: 6 },
          // Image for the node
      $(go.Picture,
        {
          margin: new go.Margin(10, 0, 0, 0),
          width: 50, // Set desired width for the image
          height: 50, // Set desired height for the image
          imageStretch: go.GraphObject.Uniform, // Maintain aspect ratio
          cursor: 'pointer'
        },
        new go.Binding('source', 'image', (src) => src && src.trim() !== "" ? src : 'assets/images/defualt.jpg')),
       // Bind the image source dynamically
          $(go.TextBlock,
            {
              font: 'bold 18px sans-serif',
              stroke: '#333333',
              margin: new go.Margin(10, 0, 0, 0)
            },
            new go.Binding('text', 'name')), // Employee name binding
          $(go.TextBlock,
            {
              font: '16px sans-serif',
              stroke: '#666666',
              margin: new go.Margin(10, 0, 0, 0)
            },
            new go.Binding('text', 'department')), // Department name binding
          $(go.TextBlock,
            {
              font: '14px sans-serif',
              stroke: '#999999',
              margin: new go.Margin(10, 0, 0, 0)
            },
            new go.Binding('text', 'title')) // Position type name binding
        ),
        {
          click:(e: go.InputEvent, obj: go.GraphObject) => {
            const node = obj.part as go.Node; // Cast obj.part to Node
            if (node && node.data) {
            const nodeId = node.data.id;
            console.log("nodeId",nodeId);
            this.addEmployee(nodeId?.toString()||'0');
            }
          },
        }
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5, curve: go.Link.None },
        $(go.Shape),
        $(go.Shape, { toArrow: 'OpenTriangle' })
      );

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }

  // onNodeClick() {
  //   // Assuming the node has an `id` or some identifier
  //   // this.router.navigate(['/dashboard/company/', this.companyId]);
  //   this.addEmployee();
  // }
}
