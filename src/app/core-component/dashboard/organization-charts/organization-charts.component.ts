import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as go from 'gojs';
import { PositionService } from '../../../services/positionService/position.service';
import { PositionTypeService } from '../../../services/lockupsServices/positionTypeService/position-type.service';
import { DepartmentService } from '../../../services/lockupsServices/DepartmentService/department.service';
import { EmployeeService } from '../../../services/employeeService/employee.service'; // Import EmployeeService

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-charts.component.html',
  styleUrls: ['./organization-charts.component.css']
})
export class OrganizationChartsComponent implements AfterViewInit {
  @ViewChild('diagramDiv') diagramDiv!: ElementRef;

  private positionTypesMap = new Map<number, string>();
  private departmentsMap = new Map<number, string>();
  private employeeMap = new Map<number, string>();
companyId?:number=0
  constructor(
    private positionService: PositionService,
    private positionTypeService: PositionTypeService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService
  ) { }

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
          this.departmentsMap.set(dept.id, dept.name);
        });
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.loadEmployees({companyId:this.companyId}).subscribe(response => {
      if (response.status === 200) {
        response.data.list.forEach((employee: any) => {
          this.employeeMap.set(employee.positionId, employee.fullName);
        });
        this.loadPositions();
      }
    });
  }

  loadPositions(): void {
    this.positionService.getPosition({ positionManagerId: 0 }).subscribe(response => {
      if (response.status === 200) {
        const nodeDataArray: any[] = [];
        const linkDataArray: any[] = [];

        response.data.list.forEach((item: any) => {
          const { nodeDataArray: nodes, linkDataArray: links } = this.transformData([item]);

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

      nodeMap.set(nodeId, {
        key: nodeId,
        name: employeeName,
        title: positionTypeName,
        department: departmentName,
        id: data.id.toString()
      });

      if (parentId) {
        linkDataArray.push({ from: parentId, to: nodeId });
      }

      if (data.subPositions && data.subPositions.length > 0) {
        data.subPositions.forEach((child: any) => processNode(child, nodeId));
      }
    };

    data.forEach(node => processNode(node));
    return { nodeDataArray: Array.from(nodeMap.values()), linkDataArray };
  }

  initDiagram(nodeDataArray: any[], linkDataArray: any[]) {
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
            stroke: '#CCCCCC',
            strokeWidth: 1,
            width: 366,
            height: 153.05,
            cursor: 'pointer'
          }),
        $(go.Panel, 'Vertical',
          { margin: 6 },
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
        )
      );

    diagram.linkTemplate =
      $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5, curve: go.Link.None },
        $(go.Shape),
        $(go.Shape, { toArrow: 'OpenTriangle' })
      );

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }
}
