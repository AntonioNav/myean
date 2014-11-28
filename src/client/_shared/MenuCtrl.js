(function () {
    var MenuCtrl = function ($location,$rootScope, $cookieStore, $translate, menuFactory) {
        var vm = this;

        vm.isActive = function (path) {
            return path === ('/#' + $location.path());
        }

        vm.changeLang = function(langKey) {
            console.log('changeLang - lang: ' + langKey);
            $translate.use(langKey);
            $translate.refresh();
        };        
        
        $rootScope.opcionesMenu = menuFactory.query();
    }
    angular
        .module('appMyEAN')
        .controller('MenuCtrl', MenuCtrl);
}());



