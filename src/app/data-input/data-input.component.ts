import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Response } from "../models/response";

import * as mainActions from '../state-management/actions/main-actions';
import * as fromRoot from '../state-management/reducers/main-reducer';
import { ResponseState } from '../state-management/state/main-state';

@Component({
  selector: 'app-data-input',
  templateUrl: './data-input.component.html'
})
export class DataInputComponent implements OnInit {

    constructor(
        private store: Store<any>
    ) { 
        store.select('mainReducer')
            .subscribe( (data:State )=> {
                this.data = data;
            });
    }

    ngOnInit() {
        console.log(this.data);
    }

}
