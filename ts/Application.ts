/// <reference path="./Router.ts"/>
/// <reference path="./client/HTTPClient.ts"/>
/// <reference path="./client/XHRClient.ts"/>
class Application {
    router : Router;
    pageClient : HTTPClient;
    
    start(router : Router) {
        this.router = router;
        this.pageClient = new XHRClient('text');
        this.router.start();
    }

    fetchPage(name : string) : Promise<string> {
        let url = 'pages/' + name;
        let req = this.pageClient.newRequest();
        return req.send(Method.GET, url, {}, null)
            .then(Func.isStatus200)
            .then(Func.getBody)
    }
}