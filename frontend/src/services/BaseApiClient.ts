import { HttpStatus } from "../deps/std.ts";
import { merge } from "../../../common/utils.ts";

export class BaseApiClient {
    apiBaseUrl = "http://localhost:8080/api";

    constructor(attrs?: Partial<BaseApiClient>) {
        (attrs) && merge(this, attrs);
    }

    async callApi<T>(method = "GET", endpoint: string, reqData?: any): Promise<T> {
        let queryString;
        const headers: Record<string, string> = {};
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
        if (resp.status === HttpStatus.NoContent || !resp.body) {
            return undefined as T
        }

        return await resp.json() as T
    }

    buildQueryString(params: any) {
        return Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join("&")
    }
}
