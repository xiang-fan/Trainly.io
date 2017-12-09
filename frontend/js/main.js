// (function () { // IIFE

trainly.config(Config);
trainly.controller("DashboardController", DashboardController);
trainly.controller("CourseController", CourseController);


function DashboardController($scope, $routeParams, apiService) {
  $scope.userId = $routeParams.uid;
  apiService.getUserById($scope.userId)
  .then(function(response) {
    console.log(response);
    $scope.user = response.data[0].data[0];
    //$scope.buttons = ['Look Up Courses', 'Enrolled Courses', 'Playlist', 'Account History']
  });
}

function CourseController($scope, apiService) {
  apiService.getAllCourses()
  .then(function(response) {
    $scope.courses = response.data[0].data;
    console.log(response);
  });
}

function Config($routeProvider) {
  $routeProvider
  .when("/user/:uid", {
    templateUrl: "frontend/templates/dashboard.html",
    controller: "DashboardController",
    controllerAs: "model"
  })
  .when("/courses", {
    templateUrl: "frontend/templates/courses.html",
    controller: "CourseController",
    controllerAs: "model"
  })
}

// })();