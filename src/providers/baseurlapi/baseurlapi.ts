import { HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseurlapiProvider {
base_url : String= 'http://simerjit.gangtask.com/japannurse/api/'; 
  constructor(public http: HttpClient) {
    console.log('Hello BaseurlapiProvider Provider');
  }
  public serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
        return result.join("&");
  }
}
