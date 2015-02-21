(function () {
    var usersCtrl = function ($scope, $rootScope, $filter, $translate, $translatePartialLoader, ngTableParams, usersFactory) { 

        $translatePartialLoader.addPart('users');
        $translate.refresh()
            
        var data = [];
        var backupName,
            backupEmail,
            backupSendMail;
        
        $scope.title = {
                    col1: '#',
                    col2: 'Name',
                    col3: 'Email',
                    col4: 'Sendmail'
                };

        $scope.prueba = 'prueba';
        
        $scope.nu = {SendMail: 1};

        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {Id: 'asc'},
            filter: {Name: ''}
            },{
            total: 0,
            getData: function($defer, params) {
                usersFactory.getUsers()
                    .success(function (res) {
                        var filteredData = params.filter() ?
                            $filter('filter')(res, params.filter()) :
                            res;
                        var orderedData = params.sorting() ?
                            $filter('orderBy')(filteredData, params.orderBy()) :
                            filteredData;
                        params.total(orderedData.length); // set total for recalc pagination
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    })
            }
        });
    
        $scope.editId = -1;

        $scope.setEditId =  function(pid, p) {
            $scope.editId = pid;
            if (pid === -1){
                p.Name = backupName;
                p.Email = backupEmail;
                p.SendMail = backupSendMail;
                p.Pass1 = '';
                p.Pass2 = '';
                p.PassErr = false;
            } else {
                backupName = p.Name;
                backupEmail = p.Email;
                backupSendMail = p.SendMail;
            }
            $rootScope.message = '';
        };

        //Update User
        $scope.putUser = function (p) {

            if (!(p.Pass1 === p.Pass2)) {
                return p.PassErr = true;
            } else {
                p.PassErr = false;
            }

            if ((backupName === p.Name) && (backupEmail === p.Email) && (backupSendMail === p.SendMail) && (!p.Pass1)){
                //No changes, no send to backend.
                return $scope.editId = -1;
            } else {
                usersFactory.putUser(p.Id, p.Name, p.Email, p.SendMail, p.Pass1)
                    .success(function(res) {
                        $scope.editId = -1;
                        $rootScope.message = 'Usuarios Actualizados: ' + res;
                        $scope.tableParams.reload();
                    })
                    .error(function(err){
                        $rootScope.message = err;
                    });
            }
        };

        $scope.cancelInsertForm = function (nu) {

            nu.Name = '';
            nu.Email = '';
            nu.Pass1 = '';
            nu.Pass2 = '';
            nu.SendMail = 1;
            nu.showInsertForm = false;
            $rootScope.message = '';
            $scope.insertForm.$setPristine();
        };

        $scope.insertUser = function (nu) {
            usersFactory.newUser(nu.Name, nu.Email, nu.SendMail, nu.Pass1)
                .success(function(res) {
                    $scope.cancelInsertForm(nu);
                    $rootScope.message = 'Create user with ID: ' + res;
                    $scope.tableParams.reload();
                })
                .error(function(err){
                    $rootScope.message = err;
                });
        };
        
        $scope.delUser = function(p) {
            if (confirm('Are you sure you want to delete the user ' + p.Email + '?')) {
                usersFactory.deleteUser(p.Id)
                    .success(function(res) {
                        $scope.tableParams.reload();
                        $rootScope.message = 'User delete with Id: ' + res;
                    });
            };
        };

    }
    angular
        .module("appMyEAN")
        .controller("usersCtrl", usersCtrl);
}());