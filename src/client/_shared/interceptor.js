(function () {
    var interceptor =
        function ($q, $log, $location, $cookieStore, $rootScope) {
            return {
                request: function (request) {
                    $log.info('request:' + request.url);
                    var idSesion =$cookieStore.get("idSesion");
                    $log.info("idSesion actual:" + idSesion);
                    request.headers["idSesion"] = idSesion;
                    return request || $q.when(request);
                },
                responseError: function (response) {
                    $log.error("err: " + response.status + " de :" + response.config.url);
                    if (response.status === 400) {
                        $rootScope.mensaje = "Culpa mía :-(";
                    } else if (response.status === 401) {
                        $rootScope.mensaje = "No hay derecho!!!";
                        $location.path('/usuarios/registro');
                    } else if (response.status === 419) {
                        $rootScope.mensaje = "Estoy caduco!!!";
                        $cookieStore.remove("idSesion");
                        $cookieStore.remove("usuario");
                        $location.path('/usuarios/login');
                    } else if (response.status === 404) {
                        $rootScope.mensaje = "No se ha encontrado algo!!!";
                    } else if (response.status === 500) {
                        $rootScope.mensaje = "El servidor ha fallado :-)";
                    }
                    return $q.reject(response);
                }
            };
        }

    var intercepcionesHttp = function ($httpProvider) {
        $httpProvider.interceptors.push(interceptor);
    }

    angular.module('appTuCuenta').config(intercepcionesHttp);

}());