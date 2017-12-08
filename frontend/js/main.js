// (function () { // IIFE
var abcd = angular.module("abcd", ['ngRoute']);

abcd.config(Config);
abcd.controller("DashboardController", DashboardController);


function DashboardController($scope, $http, $routeParams) {
  $scope.userId = $routeParams.uid;
  $http.get("api/user/" + $scope.userId)
  .then(function(response) {
    console.log(response)
    $scope.user = response.data[0].data[0];
    $scope.buttons = ['Look Up Courses', 'Enrolled Courses', 'Playlist', 'Account History']
  });
}

function CoursesCountroller($scope, $http, $routeParams) {
  $scope.courseid = $routeParams.cid;
  $http.get("api/courses/" + $scope.cid)
  .then(function(response) {
    $scope.courses = response.data;
    console.log(response)
  });
}

function Config($routeProvider) {
  $routeProvider
  .when("/user/:uid", {
    templateUrl: "frontend/templates/dashboard.html",
    controller: "DashboardController",
    controllerAs: "model"
  })

  .when("/courses/:cid", {
    templateUrl: "frontend/templates/courses.html",
    controller: "CoursesController",
    controllerAs: "model"
  })
}

// })();