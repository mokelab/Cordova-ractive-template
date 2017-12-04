/// <reference path="../Application.ts"/>
/// <reference path="../Page.ts"/>
/// <reference path="../ractive.d.ts"/>

class TopPage implements Page {
    app : Application;
    ractive : Ractive.Ractive;

    constructor(app : Application) {
        this.app = app;
    }

    onCreate() {
        this.app.fetchPage('top.html').then((t : any) => {
            this.ractive = new Ractive({
                el : '#container',
                template : t,
            });
        }).catch((e : any) => {
            console.log('Unexpected error ' + e);
        });
    }
}