import { merge } from "../../../common/utils.ts";

export class BaseApiClient {
    apiBaseUrl: string = "http://localhost:8080/api";

    constructor(attrs?: Partial<BaseApiClient>) {
        (attrs) && merge(this, attrs);
    }

    async callApi<T>(method: string = "GET", endpoint: string, reqData?: any): Promise<T> {
        let queryString;
        let headers = {};
        let reqBody;
        if (!reqData) {
            queryString = "";
            reqBody = undefined;
        } else if (method == "GET") {
            queryString = `?${this.buildQueryString(reqData)}`;
            reqBody = undefined;
        } else {
            queryString = "";
            headers["Content-Type"] = "application/json";
            reqBody = reqData;
        }

        const resp = await fetch(`${this.apiBaseUrl}/${endpoint}${queryString}`, {
            method,
            headers,
            body: (reqBody) ? JSON.stringify(reqBody) : undefined,
        });

        return await resp.json() as T
    }

    buildQueryString(params: any) {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join("&")
    }
}
