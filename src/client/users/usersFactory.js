(function () {
    var usersFactory =   function ($http)  {
        var factoria = {};

        factoria.getUsers = function () {
            return $http.get('/api/priv/users');
        }
        
        //Insert user
        factoria.newUser = function(name, email, sendmail, passwd) {
            return $http.post('/api/priv/user', {Name: name, Email:email, SendMail:sendmail, Password:passwd});
        }

        //Update user data
        factoria.putUser = function(id, name, email, sendmail, passwd) {
            return $http.put('/api/priv/user/' + id, {Name: name, Email:email, SendMail:sendmail, Password: passwd});
        }

        //Delete user
        factoria.deleteUser = function(id) {
            return $http.delete('/api/priv/user/' + id);
        }

        return factoria;
    };
    angular.module("appMyEAN").factory('usersFactory', usersFactory);
}());