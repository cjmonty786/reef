import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http'; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  lineChartData:Array<any>;
  lineChartLabels:Array<any>;
  lineChartOptions:any = {
    responsive: true
  };

  lineChartLegend:boolean = true;
  lineChartType:string = 'line';

   constructor(private http:Http){

   }
   ngOnInit(){
      this.http.get("http://192.168.0.42:5000/api/temp").subscribe(x => {
        let z:Array<any> = [];
        let data = x.json();
        let series = [];
        let labels = [];
        for(let d of data){
          series.push(d.temp);
          let date = new Date(d.time);

          labels.push((new Date(d.time).toLocaleString("en-US",{month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'})).replace(",",""));
        }
        z.push({data: series, label: 'Temp'});
        this.lineChartData = z;
        this.lineChartLabels = labels;
    });
   }
  
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
