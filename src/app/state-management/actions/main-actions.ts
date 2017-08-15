import { Action } from "@ngrx/store";
import { Response } from "../../models/response";

export const INCREASE_NUMBER_RESPONSES = "INCREASE_NUMBER_RESPONSES";
export const DECREASE_NUMBER_RESPONSES = "DECREASE_NUMBER_RESPONSES";
export const ADD_RESPONSE              = "ADD_RESPONSE";
export const UPDATE_RESPONSE           = "UPDATE_RESPONSE";
export const REMOVE_RESPONSE           = "REMOVE_RESPONSE";
export const UPDATE_LABELS             = "UPDATE_LABELS";

export class IncreaseNumberResponses implements Action {
    readonly type = "INCREASE_NUMBER_RESPONSES";
}

export class DecreaseNumberResponses implements Action {
    readonly type = "DECREASE_NUMBER_RESPONSES";
}

export class AddResponse implements Action {
    readonly type = "ADD_RESPONSE";
}

export class UpdateResponse implements Action {
    readonly type = "UPDATE_RESPONSE";
    constructor(public payload: Response) {}
}

export class RemoveResponse implements Action {
    readonly type = "REMOVE_RESPONSE";
    constructor(public payload: Response) {}
}

export class UpdateLabels implements Action {
    readonly type = "UPDATE_LABELS";
    constructor(public payload: string[]) {}
}

export type Actions
    = IncreaseNumberResponses
    | DecreaseNumberResponses
    | AddResponse
    | UpdateResponse
    | RemoveResponse
    | UpdateLabels
