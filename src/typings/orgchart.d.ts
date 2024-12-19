declare module 'orgchart' {
    var OrgChart: any;
    export = OrgChart;
  }

  declare global {
    interface Window {
      OrgChart: any;  // or more specific type if available
    }
  }