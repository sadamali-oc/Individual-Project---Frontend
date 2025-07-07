import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
  standalone: true,
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  imports: [CommonModule, CanvasJSAngularChartsModule],
})
export class ReportComponent {
  onDummyEvent() {
    throw new Error('Method not implemented.');
  }

  // 📈 Spline Chart (Monthly breakdown)
  chartOptions = {
    animationEnabled: true,
    axisX: {
      title: 'Months',
    },
    axisY: {
      title: 'Number of Events',
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      itemclick: function (e: any) {
        if (
          typeof e.dataSeries.visible === 'undefined' ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      },
    },
    data: [
      {
        type: 'spline',
        showInLegend: true,
        name: 'Workshops',
        dataPoints: [
          { label: 'Jan', y: 2 },
          { label: 'Feb', y: 3 },
          { label: 'Mar', y: 4 },
          { label: 'Apr', y: 2 },
          { label: 'May', y: 5 },
          { label: 'Jun', y: 3 },
          { label: 'Jul', y: 4 },
          { label: 'Aug', y: 2 },
          { label: 'Sep', y: 3 },
          { label: 'Oct', y: 4 },
          { label: 'Nov', y: 2 },
          { label: 'Dec', y: 3 },
        ],
      },
      {
        type: 'spline',
        showInLegend: true,
        name: 'Seminars',
        dataPoints: [
          { label: 'Jan', y: 1 },
          { label: 'Feb', y: 2 },
          { label: 'Mar', y: 3 },
          { label: 'Apr', y: 1 },
          { label: 'May', y: 4 },
          { label: 'Jun', y: 2 },
          { label: 'Jul', y: 3 },
          { label: 'Aug', y: 1 },
          { label: 'Sep', y: 2 },
          { label: 'Oct', y: 3 },
          { label: 'Nov', y: 1 },
          { label: 'Dec', y: 2 },
        ],
      },
      {
        type: 'spline',
        showInLegend: true,
        name: 'Cultural Events',
        dataPoints: [
          { label: 'Jan', y: 1 },
          { label: 'Feb', y: 1 },
          { label: 'Mar', y: 2 },
          { label: 'Apr', y: 2 },
          { label: 'May', y: 3 },
          { label: 'Jun', y: 2 },
          { label: 'Jul', y: 1 },
          { label: 'Aug', y: 2 },
          { label: 'Sep', y: 3 },
          { label: 'Oct', y: 1 },
          { label: 'Nov', y: 2 },
          { label: 'Dec', y: 1 },
        ],
      },
    ],
  };

  // 🥧 Pie Chart (Total event type distribution)
  pieChartOptions = {
    animationEnabled: true,
    title: {
      text: 'Event Type Distribution (Yearly)',
    },
    data: [
      {
        type: 'pie',
        indexLabel: '{label}: {y}',
        startAngle: 60,
        dataPoints: [
          { y: 41, label: 'Workshops' }, // Sum of workshop Y values
          { y: 25, label: 'Seminars' }, // Sum of seminar Y values
          { y: 21, label: 'Cultural Events' }, // Sum of cultural Y values
        ],
      },
    ],
  };

  // 📊 Bar Chart (Total monthly events)
  barChartOptions = {
    animationEnabled: true,
    title: {
      text: 'Total Events Per Month',
    },
    axisX: {
      title: 'Months',
    },
    axisY: {
      title: 'Total Events',
    },
    data: [
      {
        type: 'column',
        dataPoints: [
          { label: 'Jan', y: 4 }, // 2+1+1
          { label: 'Feb', y: 6 },
          { label: 'Mar', y: 9 },
          { label: 'Apr', y: 5 },
          { label: 'May', y: 12 },
          { label: 'Jun', y: 7 },
          { label: 'Jul', y: 8 },
          { label: 'Aug', y: 5 },
          { label: 'Sep', y: 8 },
          { label: 'Oct', y: 8 },
          { label: 'Nov', y: 5 },
          { label: 'Dec', y: 6 },
        ],
      },
    ],
  };
}
