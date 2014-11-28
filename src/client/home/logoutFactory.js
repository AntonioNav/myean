(function () {
    var logoutFactory =   function ($http)  {
        var factory = {};

        factory.getLogout = function () {
            return $http.get('/api/logout/');
        }
        return factory;
    };

 angular.module("appMyEAN").factory('logoutFactory',logoutFactory);
}());