import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as go from 'gojs';
import { PositionService } from '../../../services/positionService/position.service';
 
@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-charts.component.html',
  styleUrls: ['./organization-charts.component.css']
})
export class OrganizationChartsComponent implements AfterViewInit {
  @ViewChild('diagramDiv') diagramDiv!: ElementRef;

  constructor(private positionService: PositionService) {}

  ngAfterViewInit(): void {
    this.positionService.getPosition().subscribe(response => {
      if (response.status === 200) {
        const { nodeDataArray, linkDataArray } = this.transformData(response.data.list);
        this.initDiagram(nodeDataArray, linkDataArray);
      }
    });
  }

  transformData(data: any[]): { nodeDataArray: any[], linkDataArray: any[] } {
    const nodeMap = new Map<number, any>();
    const linkDataArray: any[] = [];

    const processNode = (node: any, parentId?: number) => {
      const nodeId = node.id;
      nodeMap.set(nodeId, {
        key: nodeId,
        name: node.name,
        title: node.positionTypeId.toString(), // Assuming title is positionTypeId
        department: node.nameAr,
        id: node.id.toString()
      });

      if (parentId) {
        linkDataArray.push({ from: parentId, to: nodeId });
      }

      if (node.subPositions) {
        node.subPositions.forEach((child: any) => processNode(child, nodeId));
      }
    };

    data.forEach(node => processNode(node));
    return { nodeDataArray: Array.from(nodeMap.values()), linkDataArray };
  }

  initDiagram(nodeDataArray: any[], linkDataArray: any[]) {
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      'undoManager.isEnabled': true,
      'layout': $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
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
            new go.Binding('text', 'name')),
          $(go.TextBlock,
            {
              font: '16px sans-serif',
              stroke: '#666666',
              margin: new go.Margin(10, 0, 0, 0)
            },
            new go.Binding('text', 'department')),
          $(go.TextBlock,
            {
              font: '14px sans-serif',
              stroke: '#999999',
              margin: new go.Margin(10, 0, 0, 0)
            },
            new go.Binding('text', 'title')),
          $(go.Panel, 'Auto',
            { margin: 10 },
            $(go.Shape, 'RoundedRectangle',
              {
                fill: '#7B3FF6',
                stroke: null,
                width: 40,
                height: 20,
                margin: 2
              }),
            $(go.TextBlock,
              {
                font: 'bold 14px sans-serif',
                stroke: '#FFFFFF',
                textAlign: 'center'
              },
              new go.Binding('text', 'id'))
          )
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
