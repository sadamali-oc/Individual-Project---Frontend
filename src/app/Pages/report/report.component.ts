import { Component, NgModule } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  imports: [CanvasJSAngularChartsModule]
})
export class ReportComponent {
onDummyEvent() {
throw new Error('Method not implemented.');
}

chartOptions = {
  animationEnabled: true,  
  title: {
    text: "University Event Management - Monthly Events"
  },
  axisX: {
    title: "Months"
  },
  axisY: { 
    title: "Number of Events"                   
  },
  toolTip: {
    shared: true
  },
  legend: {
    cursor: "pointer",
    itemclick: function(e: any) {
      if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
  },
  data: [
    {        
      type: "spline",
      showInLegend: true,
      name: "Workshops",
      dataPoints: [
        { label: "Jan", y: 2 },     
        { label: "Feb", y: 3 },     
        { label: "Mar", y: 4 },     
        { label: "Apr", y: 2 },     
        { label: "May", y: 5 },     
        { label: "Jun", y: 3 },     
        { label: "Jul", y: 4 },     
        { label: "Aug", y: 2 },     
        { label: "Sep", y: 3 },     
        { label: "Oct", y: 4 },     
        { label: "Nov", y: 2 },     
        { label: "Dec", y: 3 }
      ]
    }, 
    {        
      type: "spline",
      showInLegend: true,
      name: "Seminars",
      dataPoints: [
        { label: "Jan", y: 1 },     
        { label: "Feb", y: 2 },     
        { label: "Mar", y: 3 },     
        { label: "Apr", y: 1 },     
        { label: "May", y: 4 },     
        { label: "Jun", y: 2 },     
        { label: "Jul", y: 3 },     
        { label: "Aug", y: 1 },     
        { label: "Sep", y: 2 },     
        { label: "Oct", y: 3 },     
        { label: "Nov", y: 1 },     
        { label: "Dec", y: 2 }
      ]
    },
    {        
      type: "spline",
      showInLegend: true,
      name: "Cultural Events",
      dataPoints: [
        { label: "Jan", y: 1 },     
        { label: "Feb", y: 1 },     
        { label: "Mar", y: 2 },     
        { label: "Apr", y: 2 },     
        { label: "May", y: 3 },     
        { label: "Jun", y: 2 },     
        { label: "Jul", y: 1 },     
        { label: "Aug", y: 2 },     
        { label: "Sep", y: 3 },     
        { label: "Oct", y: 1 },     
        { label: "Nov", y: 2 },     
        { label: "Dec", y: 1 }
      ]
    }
  ]
};

}