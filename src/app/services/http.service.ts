import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs'

const MAIN_PATH = 'http://localhost:4242/data/';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) {}

  getData<T>(filters: { [key: string]: string | number | undefined | null }):  Observable<HttpResponse<T>> {
    const delayTime = Math.random() * 1000 + 1000;
    const params = this.getParams(filters)

    return this._http.get<T>(MAIN_PATH, { params, observe: 'response' }).pipe(delay(delayTime));
  }

  getParams(filters: { [key: string]: string | number | undefined | null }): HttpParams {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key].toString());
      }
    });

    return params;
  }
}
