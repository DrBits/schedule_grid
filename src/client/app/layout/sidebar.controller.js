var app;
(function (app) {
    var layout;
    (function (layout) {
        'use strict';
        var SidebarController = (function () {
            function SidebarController() {
            }
            return SidebarController;
        }());
        layout.SidebarController = SidebarController;
        angular
            .module('app.layout')
            .controller('SidebarController', SidebarController);
    })(layout = app.layout || (app.layout = {}));
})(app || (app = {}));
//# sourceMappingURL=sidebar.controller.js.map