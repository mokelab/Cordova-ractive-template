///<reference path="./HTTPClient.ts"/>

class XHRClient implements HTTPClient {

    respType : XMLHttpRequestResponseType;

    constructor(respType? : XMLHttpRequestResponseType) {
        if (respType === undefined) {
            this.respType = 'json';
        } else {
            this.respType = respType;
        }
    }

    newRequest() : HTTPRequest {
        return new XHRRequest(this.respType);
    }
}

class XHRRequest implements HTTPRequest {
    xhr : XMLHttpRequest;
    respType : XMLHttpRequestResponseType;

    constructor(respType? : XMLHttpRequestResponseType) {
        this.xhr = new XMLHttpRequest();
        if (respType === undefined) {
            this.respType = 'json';
        } else {
            this.respType = respType;
        }
    }

    send(method : Method, url : string, header : any, body : any) : Promise<HTTPResponse> {
        if (header == null) {
            throw 'header must not be null';
        }
        return new Promise<HTTPResponse>((resolve : (HTTPResponse) => void, reject : (any) => void) => {
            this.xhr.open(this.toMethodStr(method), url, true);
            this.xhr.responseType = this.respType;
            for (var key in header) {
                this.xhr.setRequestHeader(key, header[key]);
            }
            this.xhr.onload = function () {                
                resolve(new HTTPResponse((<any>this).status, (<any>this).response));
            };
            this.xhr.onerror = (e : any) => {
                reject('通信できませんでした');
            };
            
            if (body == null) {
                this.xhr.send();
            } else {
                this.xhr.send(body);
            }
        });
    }
    
    cancel() {
        this.xhr.abort();
    }

    private toMethodStr(method : Method) : string {
        switch (method) {
        case Method.GET: return 'GET';
        case Method.POST: return 'POST';
        case Method.PUT: return 'PUT';
        case Method.DELETE: return 'DELETE';
        default: return 'GET';
        }
    }
}