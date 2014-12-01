(function () {
    angular.module('commonFilters', [])
        .filter('rellenar', function () {
            return function (input) {
                try {
                    if (!input || input === undefined || input.trim() === "") {
                        return '-';
                    };
                } catch (err) {
                    //console.log(JSON.stringify(err));
                    return '-';
                }
            }
        })
        .filter('transBool', function () {
            return function (input) {
                if (input == 1) {
                    return 'Bool_Yes';
                } else {
                    return 'Bool_No';
                };
            }
        })
        .filter('recortar', function () {
            return function (input, long) {
                if (!long) {
                    long = 10
                }
                if (!input || typeof input == 'undefined') {
                    return '-'
                }
                if (input.length <= long) {
                    return input
                } else {
                    return input.substring(0, long) + '...'
                }
            }
        })
        .filter('recortarFinal', function () {
            return function (input, long) {
                if (!long) {
                    long = 10
                }
                if (!input || typeof input == 'undefined') {
                    return '-'
                }
                if (input.length <= long) {
                    return input
                } else {
                    return '...' + input.substring(input.length - long) 
                }
            }
        })
        .filter('importantes', function () {
            return function (data, valorCorte) {
                if (valorCorte) {
                    var filtrados = [];
                    for (var i = 0; i < data.length; i++) {
                        var temp = data[i];
                        if (temp.presupuesto >= valorCorte) {
                            filtrados.push(temp);
                        }
                    }
                    return filtrados;
                } else {
                    return data;
                }

            }
        });
}());