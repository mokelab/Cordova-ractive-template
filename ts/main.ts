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