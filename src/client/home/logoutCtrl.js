(function () {
    var logoutCtrl = function ($rootScope, $cookieStore, $location, logoutFactory, menuFactory) {
        
        logoutFactory.getLogout()
            .success(function (res) {
                $cookieStore.remove('userData');
                $rootScope.name = '';
                $rootScope.message = 'Is gone!';
                $location.path('/');
                $rootScope.opcionesMenu = menuFactory.query();
            })
            .error(function (err) {
                console.log('logoutCtrl - err: ' + err);
                $rootScope.message('error: ' + err);
            });
    }

    angular
        .module("appMyEAN")
        .controller('logoutCtrl', logoutCtrl);
}());