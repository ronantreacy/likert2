import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Response } from "../models/response";

import * as main from '../state-management/actions/main-actions';
import * as fromRoot from '../state-management/reducers';

@Component({
  selector: 'app-data-input',
  templateUrl: './data-input.component.html'
})
export class DataInputComponent implements OnInit {

    labels: string[];
    responses$: Observable<Response[]>;
    numberResponses: Observable<number>;

    constructor(
        private store: Store<fromRoot.State>
    ) { 
        store.select(fromRoot.getLabels)
            .subscribe (labels => {
                this.labels = labels
            })
    }

    ngOnInit() {
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    };

    increaseNumberResponses(){
        this.store.dispatch(new main.IncreaseNumberResponses());
    };

    decreaseNumberResponses(){
        this.store.dispatch(new main.DecreaseNumberResponses());
    };

    updateLabels(){
        this.store.dispatch(new main.UpdateLabels(this.labels));
    };

}
