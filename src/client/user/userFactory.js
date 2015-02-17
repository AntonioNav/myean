(function () {
    var userFactory =   function ($http)  {
        var factoria = {};

        factoria.getUser = function (id) {
            return $http.get('/api/priv/user/' + id);
        }
        //Update user data
        factoria.putUser = function(id, name, email, sendmail, passwd, oldpass) {
            return $http.put('/api/priv/user/' + id, {Name: name, Email:email, SendMail:sendmail, Password: passwd, OldPass: oldpass});
        }
        //Delete user
        factoria.deleteUser = function(id) {
            return $http.delete('/api/priv/user/' + id);
        }
        return factoria;
    };
    angular.module("appMyEAN").factory('userFactory', userFactory);
}());