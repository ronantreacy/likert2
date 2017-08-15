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
    responses: Response[];
    numberResponses: number;

    constructor(
        private store: Store<fromRoot.State>
    ) { 
        store.select(fromRoot.getLabels)
            .subscribe (labels => {
                this.labels = labels;
            })
        store.select(fromRoot.getResponses)
            .subscribe(responses => {
                this.responses = responses;
            })
        store.select(fromRoot.getNumberResponses)
            .subscribe(numberResponses => {
                this.numberResponses = numberResponses;
            })
    }

    ngOnInit() {
        this.addResponse();
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

    removeResponse(response){
        this.store.dispatch(new main.RemoveResponse(response));
    };

    updateResponse(response){
        this.store.dispatch(new main.UpdateResponse(response));
    };

    addResponse(){
        this.store.dispatch(new main.AddResponse());
    };

}
