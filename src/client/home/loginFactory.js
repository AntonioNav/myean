(function () {
    var loginFactory =   function ($http)  {
        var factory = {};

        factory.postUser = function (email, password) {
            return $http.post('/api/login/', {email: email, password: password});
        }
        return factory;
    };

 angular.module("appPhoneLogger").factory('loginFactory',loginFactory);
}());