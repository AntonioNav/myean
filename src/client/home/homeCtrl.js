(function () {
    var homeCtrl = function ($rootScope, $location, $cookieStore, loginFactory, menuFactory) {
        var vm = this;
        vm.title = 'Control de llamadas';
        vm.welcome = 'Bienvenido';
        
        vm.login = function () {
            loginFactory.postUser(vm.user.email, vm.user.password)
                    .success(function (res) {
                        var user = res;
                        if (user) {
                            $rootScope.name = user.email;
                            $rootScope.message = 'ha vuelto';
                            $cookieStore.put('userData', user);
                            $location.path('/');
                            $rootScope.opcionesMenu = menuFactory.query();
                        } else {
                            $rootScope.message = 'Algo ha salido mal';
                        }
                    })
                    .error(function (err) {
                        console.log('error al recibir sessionId: ' + err);
                    });
        };
    }
    angular.module('appPhoneLogger').controller('homeCtrl', homeCtrl);
}());