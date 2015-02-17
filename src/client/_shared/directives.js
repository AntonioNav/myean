(function () {
    angular.module('commonDirectives', [])
    
        .directive('resaltado', function () {
            return {
                link: function ($scope, element, attrs) {
                    element.bind('mouseenter', function () {
                        element.css('background-color', 'yellow');
                    });
                    element.bind('mouseleave', function () {
                        element.css('background-color', 'white');
                    });
                }
            };
        });
    
/*
        //From https://github.com/TheSharpieOne/angular-input-match
        .directive('match', function () {
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {
                    match: '='
                },
                link: function(scope, elem, attrs, ctrl) {
                    scope.$watch(function() {
                        var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                        return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
                    }, function(currentValue) {
                        ctrl.$setValidity('match', currentValue);
                    });
                }
            };
        });
*/
}());