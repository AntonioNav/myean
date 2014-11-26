(function () {
    var logoutCtrl = function ($rootScope, $cookieStore, $location, logoutFactory, menuFactory) {
        
        logoutFactory.getLogout()
            .success(function (res) {
                $cookieStore.remove('userData');
                $rootScope.name = '';
                $rootScope.message = 'Ha salido';
                $location.path('/');
                $rootScope.opcionesMenu = menuFactory.query();
            })
            .error(function (err) {
                console.log('error en logout: ' + err);
                $rootScope.message('error: ' + err);
            });
    }

    angular
        .module("appPhoneLogger")
        .controller('logoutCtrl', logoutCtrl);
}());