import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Status } from './status';
import { HttpClient } from '@angular/common/http';
import { STATUS } from './mock-status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

    private statusUrl = 'http://172.20.10.2/status/';

  constructor(private http: HttpClient) { }

    getStatuses(): Observable<any> {
      // return of(STATUS);
      return this.http.get(this.statusUrl);
    }
}
