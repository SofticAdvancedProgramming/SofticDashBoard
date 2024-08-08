import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-charts.component.html',
  styleUrls: ['./organization-charts.component.css']
})
export class OrganizationChartsComponent implements AfterViewInit {
  @ViewChild('diagramDiv') diagramDiv!: ElementRef;

  nodes = [
    {
      key: 1,
      name: 'Yomna Ashraf',
      title: 'Head Of Department',
      department: 'Design Department',
      id: '01',
      children: [
        {
          key: 2,
          name: 'Mr. George Mikhaiel',
          title: 'Joiner UI/UX Designer',
          department: 'Design Department',
          id: '01',
        },
        {
          key: 3,
          name: 'Mr. George Mikhaiel',
          title: 'Senior UI/UX Designer',
          department: 'Design Department',
          id: '01',
          children: [
            {
              key: 4,
              name: 'Mr. George Mikhaiel',
              title: 'UI/UX Designer',
              department: 'Design Department',
              id: '01',
            },
            {
              key: 5,
              name: 'Mr. George Mikhaiel',
              title: 'UI/UX Designer',
              department: 'Design Department',
              id: '01',
            }
          ]
        }
      ]
    }
  ];

  ngAfterViewInit(): void {
    this.initDiagram();
  }

  initDiagram() {
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
            cursor: 'pointer',
           }),
        $(go.Panel, 'Vertical',
          { margin: 6 },
          $(go.TextBlock,
            {
              font: 'bold 18px sans-serif',
              stroke: '#333333',
              margin: new go.Margin(10, 0, 0, 0),
            },
            new go.Binding('text', 'name')),
          $(go.TextBlock,
            {
              font: '16px sans-serif',
              stroke: '#666666',
              margin: new go.Margin(10, 0, 0, 0),
            },
            new go.Binding('text', 'department')),
          $(go.TextBlock,
            {
              font: '14px sans-serif',
              stroke: '#999999',
              margin: new go.Margin(10, 0, 0, 0),
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

    const transformData = (data: any[]) => {
      const nodeMap = new Map<string, any>();
      const linkDataArray: any[] = [];

      const processNode = (node: any, parentId?: string) => {
        const nodeId = node.key;
        nodeMap.set(nodeId, {
          key: nodeId,
          name: node.name,
          title: node.title,
          department: node.department,
          id: node.id,
        });

        if (parentId) {
          linkDataArray.push({ from: parentId, to: nodeId });
        }

        if (node.children) {
          node.children.forEach((child: any) => processNode(child, nodeId));
        }
      };

      data.forEach(node => processNode(node));
      return { nodeDataArray: Array.from(nodeMap.values()), linkDataArray };
    };

    const { nodeDataArray, linkDataArray } = transformData(this.nodes);
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }
}
