(function () {
    var menuFactory =   function ($resource)  {
        return $resource("/api/menu/", {});
    };

    angular.module("appPhoneLogger").factory('menuFactory',menuFactory);
}());