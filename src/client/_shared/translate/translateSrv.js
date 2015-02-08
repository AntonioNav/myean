//From this web:
//http://technpol.wordpress.com/2013/11/02/adding-translation-using-angular-translate-to-an-angularjs-app/
//
angular.module('myTranslateSrv', ['pascalprecht.translate'])
    .config(function($translateProvider, $translatePartialLoaderProvider ) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '_shared/translate/assets/{lang}/{part}.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en-EN', 'es-ES'], {
            'es_*': 'es-ES',
            '*': 'en-EN',
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.useLocalStorage();
    });