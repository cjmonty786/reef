import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  lineChartData: Array<any>;
  lineChartLabels: Array<any>;
  lineChartOptions: any = {
    responsive: true
  };

  lineChartLegend = true;
  lineChartType = 'line';
private url = 'http://192.168.0.14:5000';
   constructor(private http: Http) {

   }
   ngOnInit() {
      this.http.get(this.url + '/api/temp').subscribe(x => {
        const z: Array<any> = [];
        const data = x.json();
        const series = [];
        const labels = [];
        for (const d of data){
          series.push(d.temp);
          const date = new Date(d.time + 'Z+0');
          labels.push(
            (date.toLocaleString('en-US',
            {month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})).replace(',', ''));
        }
        z.push({data: series, label: 'Temp'});
        this.lineChartData = z;
        this.lineChartLabels = labels;
    });
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }
  public pumpOn() {
    this.http.post(this.url + '/api/ato', {'pump': 1}).subscribe();
  }
  public pumpOff() {
    this.http.post(this.url + '/api/ato', {'pump': 0}).subscribe();
  }
}
