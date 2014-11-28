(function () {
    var menuFactory =   function ($resource)  {
        return $resource("/api/menu/", {});
    };

    angular.module("appMyEAN").factory('menuFactory',menuFactory);
}());