(function () {
    var userCtrl = function ($rootScope, $scope, $location, $cookieStore, $filter, $translate, $translatePartialLoader, userFactory) {
        var vm = this;
        
        $translatePartialLoader.addPart('user');
        $translate.refresh();
        
        var userData = $cookieStore.get('userData');
        
        if (userData) {
            vm.user = userData;
            vm.backup = JSON.parse(JSON.stringify(userData));
        } else {
            $rootScope.message = 'Something is wrong';
        };
            
        vm.cancel = function() {
            vm.Pass1 = '';
            vm.Pass2 = '';
            vm.OldPass = '';
            $scope.insertForm.$setPristine();
            vm.user = vm.backup;
            vm.user.Name = vm.backup.Name;
        };
        
        vm.updateUser = function() {
            if ((vm.user.Id == vm.backup.Id) && (vm.user.Name == vm.backup.Name) && (vm.user.Email == vm.backup.Email) 
                && (vm.user.SendMail == vm.backup.SendMail) && (!vm.Pass1)) {
                $scope.insertForm.$setPristine();
            } else {
                userFactory.putUser(vm.user.Id, vm.user.Name, vm.user.Email, vm.user.SendMail, vm.Pass1, vm.OldPass)
                    .success(function(res) {
                        if (res == 1) {
                            alert('Usuario actualizado');
                            $cookieStore.put('userData', vm.user);
                            vm.backup = JSON.parse(JSON.stringify(vm.user));
                            $scope.insertForm.$setPristine();
                        } else {
                            alert('Error: ' + res);
                        }
                    });
            }
        };
            
    }
    angular.module('appMyEAN').controller('userCtrl', userCtrl);
}());