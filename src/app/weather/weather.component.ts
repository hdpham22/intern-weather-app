import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  /*
  * Angular notes:
  * To access variables in this file, prepend the variable name with 'this.' (e.g. this.location)
  * For typescript type errors, you can use the 'any' type to bypass the error (e.g. function myFunction(name: any))
  */


  // Angular's form builder. Location is the name of the input field.
  form: FormGroup = this.fb.group({
    location: '',
  });

  // Predefined variables. Feel free to change or add more.
  location = '';
  weather?: any;
  
  showLoad?: boolean;       // boolean value to display the 'loading' screen
  
  city?: string;        // current city of weather
  temperature?: number; // temperature in farenheit
  weatherIcon?: string; // Icon illustrative of the current weather
  conditions?: any;     // current weather conditions
  lastUpt?: string;     // when the weather was last updated

  //error vars, will be used if http request throws an error
  showProblem?: boolean;  // is true to display error message if an error occurs, is false otherwise
  issue?: any;            // http error response
  code?: any;             // error code
  errMessage?: string;    // error message

  // Lifecycle hook. Called after view has initialized.
  ngOnInit() { }

  // Called when the 'Get Weather' button is clicked.
  getWeather() {
    this.location = this.form?.value.location;
    this.weather = false;
    this.showProblem = false;
    this.showLoad = true;
    // Additional code...
    this.fetchWeather();
  }


  // Call this function to fetch weather data from API (ref - https://www.weatherapi.com/)
  // This get request requires an API key and the location to get weather data for.
  // Feel free to pass parameters to this function or change this in any way.
  fetchWeather() {
    const apiKey = '310337bc4d7444778ed30742222406';
    const location = this.location; // Placeholder variable. Update or replace this variable to get weather data.

    this.http.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`).pipe(delay(1000)).subscribe({
      
      next: response => {
        this.showLoad = false;
        console.log('Get weather response: ', response);
        this.showProblem = false;
        this.weather = response;
        // Additional code...
        this.city = this.weather.location.name;
        this.conditions = this.weather.current.condition.text;
        this.weatherIcon = this.weather.current.condition.icon;
        this.temperature = this.weather.current.temp_f;
        this.lastUpt = this.weather.current.last_updated;
      },
      error: err => {
        this.showLoad = false;
        this.showProblem = true;
        console.error('Get weather error: ', err);
        this.weather = false;
        this.issue = err;
        this.code = this.issue.status;
        this.errMessage = this.issue.error.error.message;
      }
    });
  }
}
