
(function () {
    var validacionesFactory =   function (proyectosFactory)  {
        var factoria = {};

        // Validar si el proyecto existe

        factoria.esRangoValido = function (desde, hasta) {
            if (desde == "" || hasta == "")
                return false;
            if (esFechaValida(desde) == false) {
                return false;
            }
            if (esFechaValida(hasta) == true) {
                var diferencia = Date.parse(hasta) - Date.parse(desde);
                if (diferencia < 0) {
                    return false;
                } else return true;
            }
        };
        var esFechaValida = function (fecha) {
            if (fecha == undefined) {
                return false;
            }
            var dateTime = Date.parse(fecha);
            if (isNaN(dateTime)) {
                return false;
            }
            return true;
        };

        return factoria;
    };

    angular
        .module("appTuCuenta")
        .factory('validacionesFactory', validacionesFactory);
}());

