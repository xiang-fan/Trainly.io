// (function () { // IIFE

  trainly.config(Config);
  trainly.controller("DashboardController", DashboardController);
  trainly.controller("CourseController", CourseController);
  trainly.controller("MyCourseController", MyCourseController);



  function DashboardController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    apiService.getUserById($scope.user_id)
    .then(function(response) {
      console.log(response);
      $scope.user = response.data[0].data[0];
    //$scope.buttons = ['Look Up Courses', 'Enrolled Courses', 'Playlist', 'Account History']
  });
  }

  function MyCourseController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    apiService.getMyCourses($scope.user_id)
    .then(function(response) {
      $scope.mycourses = response.data[0].data;
    });

    apiService.getMyInterestedCourses($scope.user_id)
    .then(function(response) {
      $scope.myinterestedcourses = response.data[0].data;
    });
  }

  function CourseController($scope, apiService, $routeParams) {
    $scope.user_id = $routeParams.uid;
    $scope.getAllCourses = function(uid) {
      apiService.getAllCourses(uid)
      .then(function(response) {
        $scope.courses = response.data[0].data;
      });
    }

    $scope.interestcourse = function(cid) {
      apiService.interestACourse($routeParams.uid, cid)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          console.log("success");
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }

    $scope.disinterestCourse = function(cid) {
      apiService.disinterestCourse($routeParams.uid, cid)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          console.log("success");
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }


    $scope.getAllCourses($routeParams.uid);
  }

  function Config($routeProvider) {
    $routeProvider
    .when("/user/:uid", {
      templateUrl: "frontend/templates/dashboard.html",
      controller: "DashboardController",
      controllerAs: "model"
    })
    .when("/user/:uid/courses", {
      templateUrl: "frontend/templates/courses.html",
      controller: "CourseController",
      controllerAs: "model"
    })
    .when("/user/:uid/mycourses", {
      templateUrl: "frontend/templates/mycourses.html",
      controller: "MyCourseController",
      controllerAs: "model"
    })
  }

// })();