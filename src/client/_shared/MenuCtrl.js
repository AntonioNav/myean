(function () {
    var MenuCtrl = function ($location,$rootScope, $cookieStore, $translate, $translatePartialLoader, menuFactory) {
        var vm = this;

        $translatePartialLoader.addPart('menu');
        $translate.refresh()

        vm.isActive = function (path) {
            return path === ('/#' + $location.path());
        }

        vm.changeLang = function(langKey) {
            $translate.use(langKey);
            $translate.refresh();
        };        
        
        $rootScope.opcionesMenu = menuFactory.query();
    }
    angular
        .module('appMyEAN')
        .controller('MenuCtrl', MenuCtrl);
}());



