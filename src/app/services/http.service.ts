import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs'

const MAIN_PATH = 'http://localhost:4242/data/'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {}

  getData<T>(filters: any):  Observable<T> {
    const delayTime = Math.random() * 1000 + 1000;
    
    return this._http.get<T>(MAIN_PATH, { params: filters }).pipe(delay(delayTime));
  }
}
