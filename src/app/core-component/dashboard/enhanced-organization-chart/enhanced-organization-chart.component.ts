import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

// Define the OrgNode interface with 'children' as optional and 'parentId' for hierarchical relationship
interface OrgNode {
  id: number;
  name: string;
  title: string;
  parentId: number | null;
  children?: OrgNode[];  // Optional children property
}

@Component({
  selector: 'app-enhanced-organization-chart',
  standalone: true,
  imports: [],
  templateUrl: './enhanced-organization-chart.component.html',
  styleUrls: ['./enhanced-organization-chart.component.css'],
})
export class EnhancedOrganizationChartComponent implements AfterViewInit {
  // Define the data with 'id', 'name', 'title', and 'parentId' (the root node has parentId as null)
  private data: OrgNode[] = [
    { id: 1, name: 'CEO', title: 'Chief Executive Officer', parentId: null },
    { id: 2, name: 'CTO', title: 'Chief Technology Officer', parentId: 1 },
    { id: 3, name: 'CFO', title: 'Chief Financial Officer', parentId: 1 },
    { id: 4, name: 'Engineer 1', title: 'Software Engineer', parentId: 2 },
    { id: 5, name: 'Engineer 2', title: 'Software Engineer', parentId: 2 },
    { id: 6, name: 'Accountant', title: 'Finance Manager', parentId: 3 },
  ];

  ngAfterViewInit(): void {
    // Initialize a map to store nodes by their id
    const map: { [key: number]: OrgNode } = {};

    // Create nodes and initialize children array
    this.data.forEach((node) => {
      map[node.id] = { ...node, children: [] };  // Ensure each node has an empty 'children' array
    });

    // Use the first item in the data array as the root node
    const root: OrgNode = map[this.data[0].id];

    // Organize nodes into a tree structure
    this.data.forEach((node) => {
      if (node.parentId === null && node.id !== root.id) {
        // Add any root-level nodes other than the first one to the root's children
        root.children?.push(map[node.id]);
      } else if (node.parentId !== null) {
        // Add nodes with valid parentId to the corresponding parent's children array
        const parent = map[node.parentId];
        if (parent && parent.children) {
          parent.children.push(map[node.id]); // Add current node as a child of its parent
        } else {
          console.warn(`Parent with id ${node.parentId} not found for node ${node.id}`);
        }
      }
    });

    // Ensure root has children if the tree is properly built
    if (!root.children || root.children.length === 0) {
      throw new Error('No valid root children found in the organization data.');
    }

    // Create the SVG container
    const margin = 50;
    const svg = d3
      .select('svg')
      .attr('width', 2000) // Set width
      .attr('height', 5000) // Set height
      .append('g')
      .attr('transform', `translate(${margin},${margin})`);

    // Create a hierarchical structure using D3
    const rootD3 = d3.hierarchy(root);

    // Create a tree layout
    const treeLayout = d3.tree<OrgNode>().size([950, 500]).separation((a, b) => 1.5);

    // Apply the tree layout to the root
    treeLayout(rootD3);

    // Dynamically set SVG height based on tree depth
    const height = rootD3.height * 100 + margin * 2;
    svg.attr('height', height); // Update SVG height dynamically

    // Create links between nodes
    const links = svg
      .selectAll('.link')
      .data(rootD3.links())
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d) => d.source.x ?? 0)
      .attr('y1', (d) => d.source.y ?? 0)
      .attr('x2', (d) => d.target.x ?? 0)
      .attr('y2', (d) => d.target.y ?? 0)
      .attr('stroke', '#ccc');

    // Create nodes
    const nodes = svg
      .selectAll('.node')
      .data(rootD3.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    // Add square shapes for nodes with increased size
    nodes
      .append('rect')
      .attr('width', 180)  // Increased width
      .attr('height', 120)  // Increased height
      .attr('x', -90)      // Center the square horizontally
      .attr('y', -40)      // Center the square vertically
      .attr('fill', (d) => (d.depth === 0 ? 'gray' : '#663895'))  // Example background color
      .attr('rx', 10)      // Rounded corners (optional)
      .attr('ry', 10);     // Rounded corners (optional)

    // Add text labels for names
    nodes
      .append('text')
      .attr('dy', -5)  // Position the icon
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.name) // Display the name
      .style('font-size', '16px')
      .style('fill', 'white');

    // Add text labels for titles
    nodes
      .append('text')
      .attr('dy', 30)  // Position the title below the name
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.title)
      .style('font-size', '14px')
      .style('fill', 'white');
  }
}
