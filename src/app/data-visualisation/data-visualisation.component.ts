import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Response } from "../models/response";

import * as fromRoot from '../state-management/reducers';

@Component({
  selector: 'app-data-visualisation',
  templateUrl: './data-visualisation.component.html',
})
export class DataVisualisationComponent implements OnInit {

    labels: string[];
    responses: Response[];

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
    }

  ngOnInit() {
  }

}
