var app = angular.module('chirpApp',['ngRoute','ngResource'])
    .run(function($rootScope,$http){
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.logout = function(req,res){
        $http.get('/auth/signout').success(function(data){
            $rootScope.authenticated = false;
            $rootScope.current_user = '';
    });
    }
});

app.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        .when('/login',{
            templateUrl: 'login.html',
            controller: 'authController'
        })
        .when('/register',{
            templateUrl: 'register.html',
            controller: 'authController'
        });
});
app.factory('postService', function($resource){
    return $resource('/api/posts/:id');
})
app.controller('mainController',function ($rootScope, $scope, postService){
    $scope.posts = postService.query();
    $scope.newPost = {created_by:'', text: '', created_at: ''};

    $scope.post = function(){
        $scope.newPost.created_at = Date.now();
        $scope.newPost.created_by = $scope.newPost.username = $rootScope.current_user;
        postService.save($scope.newPost,function(){
            $scope.posts = postService.query();
            $scope.newPost = {created_by:'', text: '', created_at: ''};
        });
        }
});
app.controller('authController',function($scope, $rootScope, $http, $location){
    $scope.user = {username:'', password:''};
    $scope.error_message = '';
    
    $scope.login = function(){
        $http.post('/auth/login',$scope.user).success(function(data){
            $rootScope.authenticated = true;
            $rootScope.current_user = $scope.user.username;
            $location.path('/');
        });
    };
    
    $scope.register = function(){
        $http.post('/auth/signup',$scope.user).success(function(data){            
            $rootScope.authenticated = true;
            $rootScope.current_user = $scope.user.username;
            $location.path('/');
        })
    };
    $scope.signout = function(){
        $http.get('/auth/signout',$scope.user).success(function(data){
            $rootScope.authenticated = false;
            $rootScope.current_user = '';
        });
    };
});