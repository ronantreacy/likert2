interface ResponseCount {
    count: number;
};

export interface Response {
    id: number;
    question: string;
    responses: ResponseCount[];
};

