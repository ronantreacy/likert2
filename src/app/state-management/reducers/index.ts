import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromMain from "./main-reducer";

export interface State {
    main: fromMain.State;
}

export const reducers: ActionReducerMap<State> = {
    main: fromMain.reducer
};

export const getMainState = (state: State) => state.main;

export const getResponses = createSelector(
    getMainState,
    fromMain.getResponses
);

export const getNumberResponses = createSelector(
    getMainState,
    fromMain.getNumberResponses
);

export const getLabels = createSelector(
    getMainState,
    fromMain.getLabels
);

export const getChartType = createSelector(
    getMainState,
    fromMain.getChartType
);

