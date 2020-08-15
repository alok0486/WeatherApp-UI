import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { FormGroup, FormControl,FormBuilder } from '@angular/forms';
import { __spreadArrays } from 'tslib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weatherApp';
  key: number;
  name:string;
  weatherList : Array<any> = [];
  minTempList : Array<any> = [];
  maxTempList : Array<any> = [];
  countryForm: FormGroup;
  selectedValue: any = 'select';
  cities = [{name:'sunnyvale',id:'sunnyvale'},{name:'Casara Castelle',id:'ca'} ,{name:'Los Angeles',id:'la'}]
  restItems: any;

 httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ){}

  ngOnInit(){
    this.countryForm = this.fb.group({
     
    });
  }

  getWeatherInfo(city: string, country: string){
    return this.http
      .get<any[]>('http://localhost:8080/weatherInfo/'+city+'/ca')
      .pipe(map(data => data)
      );
    }

  getRestItems(city: string, country: string): void {
    this.getWeatherInfo(city,country)
      .subscribe(
        restItems => {
          this.restItems = restItems;
         //console.log(this.restItems);
         this.weatherList = [];
          Object.keys(restItems).forEach(key => {
            var obj1 = restItems[key];
           // console.log('key is ' + key + ' val is ' + obj1);
           if(key.toString() == 'forecasts'){
              this.getForcastValues(key, obj1);
           }
            Object.keys(obj1).forEach(key1 => {
            // console.log('key inner is ' + key1 + ' val is ' + obj1[key1]);
              var innerObj = obj1[key1];
                if(key1.toString() == 'pubDate'){
                  this.weatherList.push({[key1.toString()]:new Date(obj1[key1])})
                }
                if(key1.toString() == 'condition'){
                    Object.keys(innerObj).forEach(innerkey => {
                      if(innerkey.toString() == 'temperature'){
                        this.weatherList.push({[innerkey.toString()]:innerObj[innerkey]})
                      }
                      if(innerkey.toString() == 'text'){
                        this.weatherList.push({[innerkey.toString()]:innerObj[innerkey]})
                      }
                    })
                  }
              })
            });
        });
      }
    
      selectChange(event: any){
        if(event.target.value == 'select'){
          this.selectedValue = 'select';
          this.weatherList=[];
        }else{
            this.selectedValue = event.target.value;
            this.getRestItems(this.selectedValue,'ca');
        }
      }
     
      getForcastValues(key, obj: any){
          var innerObj = [];
          innerObj = obj;
          console.log(innerObj);
         
          if( obj.length > 0 ) {
              obj.forEach((obj)=>{
                this.minTempList.push(innerObj.find(({low}) => obj.low > low));
                this.maxTempList.push(innerObj.find(({high}) => obj.high < high));
              });
              this.weatherList.push({['minTempForecast']:this.minTempList[1].low});
              this.weatherList.push({['maxTempForecast']:this.maxTempList[0].high})
              this.weatherList.push({['minTempForecastDate']:new Date(this.minTempList[1].date)});
              this.weatherList.push({['maxTempForecastDate']:new Date(this.maxTempList[0].date)})
           }
          var avgMaxTempForecast = this.findAverageHighTemperature(innerObj);
          var avgMinTempForecast = this.findAverageLowTemperature(innerObj)
          this.weatherList.push({['avgMaxTempForecast']:avgMaxTempForecast});
          this.weatherList.push({['avgMinTempForecast']:avgMinTempForecast})

          var middleMaxTempForecast=  this.findMiddelHighTemperature(innerObj);
          var middleMinTempForecast = this.findMiddelLowTemperature(innerObj);
          this.weatherList.push({['middleMaxTempForecast']:middleMaxTempForecast});
          this.weatherList.push({['middleMinTempForecast']:middleMinTempForecast})
      }

      findAverageHighTemperature(list : any)
      {
        let sum = 0;
        let totalCount = 10;
        let avg = sum / totalCount;
          for (let i = 0; i < list.length; i++)
          {
          sum += list[i].high;
          }
        return avg = sum/10;
      }
      
      findAverageLowTemperature(list : any)
      {
        let sum = 0;
        let totalCount = 10;
        let avg = sum / totalCount;
          for (let i = 0; i < list.length; i++)
          {
          sum += list[i].high;
          }
        return avg = sum/10;
      }

      findMiddelHighTemperature(list : any)
      {
        let sum = 0;
        let hightemp = []
        for (let i = 0; i < list.length; i++)
        {
          hightemp.push(list[i].high);
        }
        for (let i = 0; i < hightemp.length; i++)
        {
          var middle = hightemp[Math.round((hightemp.length - 1) / 2)];
        }
        return middle;
      }

      findMiddelLowTemperature(list : any)
      {
        let sum = 0;
        let lowtemp = []
        for (let i = 0; i < list.length; i++)
        {
          lowtemp.push(list[i].low);
        }
        for (let i = 0; i < lowtemp.length; i++)
        {
          var middle = lowtemp[Math.round((lowtemp.length - 1) / 2)];
        }
        return middle;
      }
}
