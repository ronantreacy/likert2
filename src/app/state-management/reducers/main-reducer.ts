import { initialState } from "../state/main-state";
import { Response } from "../../models/response";
import * as MainActions from "../actions/main-actions";

var id: number = 0;

export function mainReducer(state = initialState, action){

    switch (action.type) {
        case MainActions.INCREASE_NUMBER_RESPONSES: {
            return {
                numberResponses: state.numberResponses + 1,
                responses: state.responses.map(function(r){
                    return Object.assign({}, r, {responses: [...r.responses, 0]});
                }),
                labels: [...state.labels, ""]
            };
        }
        case MainActions.DECREASE_NUMBER_RESPONSES: {
            return {
                numberResponses: state.numberResponses - 1,
                responses: state.responses.map(function(r){
                    return Object.assign({}, r, {responses: [...r.responses].splice(-1,1)});
                }),
                labels: [...state.labels].splice(-1,1)
            };
        }
        case MainActions.ADD_RESPONSE: {
            id++;
            return {
                numberResponses: state.numberResponses,
                responses: [...state.responses, Object.assign({}, action.payload, {id: id})],
                labels: [...state.labels]
            };
        }
        case MainActions.UPDATE_RESPONSE: {
            return {
                numberResponses: state.numberResponses,
                responses: state.responses.map(function(r){
                    return r.id != action.payload.id ? Object.assign({}, r) : action.payload;
                }),
                labels: [...state.labels]
            };
        }
        case MainActions.REMOVE_RESPONSE: {
            return {
                numberResponses: state.numberResponses,
                responses: state.responses.filter(function(r){
                    return r.id != action.payload.id;
                }),
                labels: [...state.labels]
            };
        }
        case MainActions.UPDATE_LABELS: {
            return {
                numberResponses: state.numberResponses,
                responses: [...state.responses],
                labels: action.payload
            };
        }
        default: {
            return state;
        }
    }

};
