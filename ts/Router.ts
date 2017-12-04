/// <reference path="./Application.ts"/>
/// <reference path="./Page.ts"/>
/// <reference path="./pages/Pages.ts"/>
declare var Backbone;


class Router {
    router : any;
    page : Page;

    constructor(app : Application) {
        let MyRouter = Backbone.Router.extend({
            routes : {
                "" : "top",
            },
            top : function(){
                this.showPage(new TopPage(app));
            },
            showPage : (p : Page) => {
                this.page = p;
                this.page.onCreate();
                console.log('showPage');
            }
        });

        this.router = new MyRouter();
    }

    start() {
        Backbone.history.start();
    }
}