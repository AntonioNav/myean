(function () {
    var homeCtrl = function ($rootScope, $location, $cookieStore, $filter, $translate, $translatePartialLoader, loginFactory, menuFactory) {
        var vm = this;
        
        $translatePartialLoader.addPart('home');
        $translate.refresh()
            
        vm.login = function () {
            loginFactory.postUser(vm.user.email, vm.user.password)
                    .success(function (res) {
                        var user = res;
                        if (user) {
                            $rootScope.name = user.email;
                            $rootScope.message = 'User is back';
                            $cookieStore.put('userData', user);
                            $location.path('/');
                            $rootScope.opcionesMenu = menuFactory.query();
                        } else {
                            $rootScope.message = 'Something is wrong';
                        }
                    })
                    .error(function (err) {
                        console.log('SessionId error: ' + err);
                    });
        };
    }
    angular.module('appMyEAN').controller('homeCtrl', homeCtrl);
}());