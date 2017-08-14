import { Response } from "../../models/response";

export interface ResponseState {
    responses: Response[];
    numberResponses: number;
    labels: string[];
}

export const initialState: ResponseState = {
    responses: [],
    numberResponses: 4,
    labels: ["","","",""]
};
