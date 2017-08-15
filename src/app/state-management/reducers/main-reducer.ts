import { Response } from "../../models/response";
import * as MainActions from "../actions/main-actions";

export interface State {
    responses: Response[];
    numberResponses: number;
    labels: string[];
    chartType: string;
}

export const initialState: State = {
    responses: [],
    numberResponses: 4,
    labels: ["","","",""],
    chartType: "bubbles"
}

var id: number = 0;

export function reducer(state = initialState, action: MainActions.Actions): State {

    switch (action.type) {
        case MainActions.INCREASE_NUMBER_RESPONSES: {
            return {
                numberResponses: state.numberResponses + 1,
                responses: state.responses.map(function(r){
                    return Object.assign({}, r, {responses: [...r.responses, 0]});
                }),
                labels: [...state.labels, ""],
                chartType: state.chartType
            };
        }
        case MainActions.DECREASE_NUMBER_RESPONSES: {
            return {
                numberResponses: state.numberResponses - 1,
                responses: state.responses.map(function(r){
                    return Object.assign({}, r, {responses: [...r.responses].slice(0,-1)});
                }),
                labels: [...state.labels].slice(0,-1),
                chartType: state.chartType
            };
        }
        case MainActions.ADD_RESPONSE: {
            id++;
            var emptyResponse: Response = {
                question: "",
                id: id,
                responses: Array.apply(null, {length: state.numberResponses}).map(function(){ return 0; })
            };
            return {
                numberResponses: state.numberResponses,
                responses: [...state.responses, Object.assign({}, emptyResponse)],
                labels: [...state.labels],
                chartType: state.chartType
            };
        }
        case MainActions.UPDATE_RESPONSE: {
            return {
                numberResponses: state.numberResponses,
                responses: state.responses.map(function(r){
                    return r.id != action.payload.id ? Object.assign({}, r) : action.payload;
                }),
                labels: [...state.labels],
                chartType: state.chartType
            };
        }
        case MainActions.REMOVE_RESPONSE: {
            return {
                numberResponses: state.numberResponses,
                responses: state.responses.filter(function(r){
                    return r.id != action.payload.id;
                }),
                labels: [...state.labels],
                chartType: state.chartType
            };
        }
        case MainActions.UPDATE_LABELS: {
            return {
                numberResponses: state.numberResponses,
                responses: [...state.responses],
                labels: action.payload,
                chartType: state.chartType
            };
        }
        case MainActions.UPDATE_CHART_TYPE: {
            return {
                numberResponses: state.numberResponses,
                responses: [...state.responses],
                labels: [...state.labels],
                chartType: action.payload
            };
        }
        default: {
            return state;
        }
    }

};

export const getLabels = (state: State) => state.labels;

export const getNumberResponses = (state: State) => state.numberResponses;

export const getChartType = (state: State) => state.chartType;

export const getResponses = (state: State) => state.responses;

