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
                "second" : "second",
            },
            top : function(){
                this.showPage(new TopPage(app));
            },
            second : function(){
                this.showPage(new SecondPage(app));
            },            
            showPage : (p : Page) => {
                this.page = p;
                this.page.onCreate();
            }
        });

        this.router = new MyRouter();
    }

    start() {
        Backbone.history.start();
    }

    show(path : string) {
        this.router.navigate(path, {trigger:true});
    }
}