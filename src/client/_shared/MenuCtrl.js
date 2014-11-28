(function () {
    var MenuCtrl = function ($location,$rootScope, $cookieStore, menuFactory) {
        var vm = this;

        vm.isActive = function (path) {
            return path === ('/#' + $location.path());
        }

        $rootScope.opcionesMenu = menuFactory.query();
    }
    angular
        .module('appMyEAN')
        .controller('MenuCtrl', MenuCtrl);
}());



