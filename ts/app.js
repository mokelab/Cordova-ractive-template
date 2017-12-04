/// <reference path="../Application.ts"/>
/// <reference path="../Page.ts"/>
/// <reference path="../ractive.d.ts"/>
class TopPage {
    constructor(app) {
        this.app = app;
    }
    onCreate() {
        this.app.fetchPage('top.html').then((t) => {
            let options = {
                el: '#container',
                template: t,
                showSecond: () => {
                    this.app.showPage('second');
                }
            };
            this.ractive = new Ractive(options);
        }).catch((e) => {
            console.log('Unexpected error ' + e);
        });
    }
}
/// <reference path="../Application.ts"/>
/// <reference path="../Page.ts"/>
/// <reference path="../ractive.d.ts"/>
class SecondPage {
    constructor(app) {
        this.app = app;
    }
    onCreate() {
        this.app.fetchPage('second.html').then((t) => {
            this.ractive = new Ractive({
                el: '#container',
                template: t,
            });
        }).catch((e) => {
            console.log('Unexpected error ' + e);
        });
    }
}
/// <reference path="./TopPage.ts"/>
/// <reference path="./SecondPage.ts"/> 
/// <reference path="./Application.ts"/>
/// <reference path="./Page.ts"/>
/// <reference path="./pages/Pages.ts"/>
class Router {
    constructor(app) {
        let MyRouter = Backbone.Router.extend({
            routes: {
                "": "top",
                "second": "second",
            },
            top: function () {
                this.showPage(new TopPage(app));
            },
            second: function () {
                this.showPage(new SecondPage(app));
            },
            showPage: (p) => {
                this.page = p;
                this.page.onCreate();
            }
        });
        this.router = new MyRouter();
    }
    start() {
        Backbone.history.start();
    }
    show(path) {
        this.router.navigate(path, { trigger: true });
    }
}
var Method;
(function (Method) {
    Method[Method["GET"] = 0] = "GET";
    Method[Method["POST"] = 1] = "POST";
    Method[Method["PUT"] = 2] = "PUT";
    Method[Method["DELETE"] = 3] = "DELETE";
})(Method || (Method = {}));
class HTTPResponse {
    constructor(status, body) {
        this.status = status;
        this.body = body;
    }
}
var Func;
(function (Func) {
    function checkStatus(code) {
        return (resp) => {
            if (resp.status == code) {
                return Promise.resolve(resp);
            }
            else {
                return Promise.reject(resp);
            }
        };
    }
    Func.checkStatus = checkStatus;
    Func.isStatus200 = checkStatus(200);
    function getBody(resp) {
        return resp.body;
    }
    Func.getBody = getBody;
    function toTrue(resp) {
        return true;
    }
    Func.toTrue = toTrue;
    function getJSONArray(key) {
        return (json) => {
            return json[key];
        };
    }
    Func.getJSONArray = getJSONArray;
    function map(func) {
        return (array) => {
            let list = [];
            array.forEach((item) => {
                list.push(func(item));
            });
            return list;
        };
    }
    Func.map = map;
})(Func || (Func = {}));
///<reference path="./HTTPClient.ts"/>
class XHRClient {
    constructor(respType) {
        if (respType === undefined) {
            this.respType = 'json';
        }
        else {
            this.respType = respType;
        }
    }
    newRequest() {
        return new XHRRequest(this.respType);
    }
}
class XHRRequest {
    constructor(respType) {
        this.xhr = new XMLHttpRequest();
        if (respType === undefined) {
            this.respType = 'json';
        }
        else {
            this.respType = respType;
        }
    }
    send(method, url, header, body) {
        if (header == null) {
            throw 'header must not be null';
        }
        return new Promise((resolve, reject) => {
            this.xhr.open(this.toMethodStr(method), url, true);
            this.xhr.responseType = this.respType;
            for (var key in header) {
                this.xhr.setRequestHeader(key, header[key]);
            }
            this.xhr.onload = function () {
                resolve(new HTTPResponse(this.status, this.response));
            };
            this.xhr.onerror = (e) => {
                reject('通信できませんでした');
            };
            if (body == null) {
                this.xhr.send();
            }
            else {
                this.xhr.send(body);
            }
        });
    }
    cancel() {
        this.xhr.abort();
    }
    toMethodStr(method) {
        switch (method) {
            case Method.GET: return 'GET';
            case Method.POST: return 'POST';
            case Method.PUT: return 'PUT';
            case Method.DELETE: return 'DELETE';
            default: return 'GET';
        }
    }
}
/// <reference path="./Router.ts"/>
/// <reference path="./client/HTTPClient.ts"/>
/// <reference path="./client/XHRClient.ts"/>
class Application {
    start(router) {
        this.router = router;
        this.pageClient = new XHRClient('text');
        this.router.start();
    }
    fetchPage(name) {
        let url = 'pages/' + name;
        let req = this.pageClient.newRequest();
        return req.send(Method.GET, url, {}, null)
            .then(Func.isStatus200)
            .then(Func.getBody);
    }
    showPage(path) {
        this.router.show(path);
    }
}
/// <reference path="./Application.ts"/>
/// <reference path="./Router.ts"/>
(() => {
    function onDeviceReady() {
        let app = new Application();
        let router = new Router(app);
        app.start(router);
        console.log('Done');
    }
    document.addEventListener('deviceready', onDeviceReady, false);
})();
