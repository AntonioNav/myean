(function () {
    var routes = function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeCtrl',
                controllerAs: 'vm',
                templateUrl: 'home/home.html'
            })
            .when('/login', {
                controller: 'homeCtrl',
                controllerAs: 'vm',
                templateUrl: 'home/login.html'
            })
            .when('/register', {
                controller: 'homeCtrl',
                controllerAs: 'vm',
                templateUrl: 'home/register.html'
            })
            .when('/user', {
                controller: 'userCtrl',
                controllerAs: 'vm',
                templateUrl: 'user/profile.html'
            })
            .when('/users/list', {
                controller: 'usersCtrl',
                templateUrl: 'users/listUsers.html'
            })
            .when('/logout', {
                controller: 'logoutCtrl',
                controllerAs: 'vm',
                templateUrl: 'home/home.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    };

    angular.module('appMyEAN').config(routes);
}());