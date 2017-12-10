// (function () { // IIFE

  trainly.config(Config);
  trainly.controller("DashboardController", DashboardController);
  trainly.controller("CourseController", CourseController);
  trainly.controller("MyCourseController", MyCourseController);
  trainly.controller("CourseDetailController", CourseDetailController);
  trainly.controller("LoginController", LoginController);

  function LoginController($scope, $routeParams, apiService, $location) {
    $scope.login = function() {
      apiService.login($scope.model.username, $scope.model.password)
      .then(function(response) {
        $scope.user = response.data[0].data[0];
        $scope.loginError = "";
        $location.path('user/' + $scope.user.user_id);
      })
      .catch(function(error) {
        console.log(error);
        $scope.loginError = error.data;
      });
    }
  }


  function DashboardController($scope, $routeParams, apiService) {
    $scope.user_id = $routeParams.uid;
    apiService.getUserById($scope.user_id)
    .then(function(response) {
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

    $scope.enrollCourse = function(course) {
      apiService.enrollCourse($routeParams.uid, course.course_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          alert("Successfully enrolled course " + course.name);
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }

    $scope.interestcourse = function(cid) {
      apiService.interestACourse($routeParams.uid, cid)
      .then(function(response) {
        if (response.data[0].result == 'success') {
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
          $scope.getAllCourses($routeParams.uid);
        }
        else {
          console.log("error");
        }
      });
    }


    $scope.getAllCourses($routeParams.uid);
  }

  function CourseDetailController($scope, $routeParams, apiService, $location) {
    $scope.user_id = $routeParams.uid;
    $scope.course_id = $routeParams.cid;
    $scope.getIncompletedMaterials = function(uid, cid) {
      apiService.getIncompletedMaterials(uid, cid)
      .then(function(response) {
        $scope.incompletedmaterials = response.data[0].data;
        console.log($scope.incompletedmaterials);
      });
    }
    
    $scope.getCompletedMaterials = function(uid, cid) {
      apiService.getCompletedMaterials(uid, cid)
      .then(function(response) {
        $scope.completedmaterials = response.data[0].data;
        console.log($scope.completedmaterials);
      });
    }
    $scope.getProgress = function(uid, cid) {
      apiService.getProgress(uid, cid)
      .then(function(response) {
        $scope.progress = response.data[0].data[0];
        $scope.percentage = (parseInt($scope.progress.completed_count) / parseInt($scope.progress.total_count) * 100).toFixed(2)
      });
    }

    $scope.getIncompletedMaterials($scope.user_id, $scope.course_id);
    $scope.getCompletedMaterials($scope.user_id, $scope.course_id);
    $scope.getProgress($scope.user_id, $scope.course_id);

    $scope.replaceUrl = function(url) {
      return url.replace("watch?v=", "embed/");
    }

    $scope.completeMaterial = function(material) {
      apiService.completeMaterial($scope.user_id, material.incompleted_material_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          console.log("success");
          $scope.getIncompletedMaterials($scope.user_id, $scope.course_id);
          $scope.getCompletedMaterials($scope.user_id, $scope.course_id);
          $scope.getProgress($scope.user_id, $scope.course_id);
        }
        else {
          console.log("error");
        }
      });
    }

    $scope.completeCourse = function() {
      apiService.completeCourse($scope.user_id, $scope.course_id)
      .then(function(response) {
        if (response.data[0].result == 'success') {
          alert("You have completed this course!")
          $location.path('user/' + $scope.user_id + '/mycourses');
        }
        else {
          console.log("error");
        }
      });
    }
  }

  function Config($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "frontend/templates/login.html",
      controller: "LoginController",
      controllerAs: "model"
    })
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
    .when("/user/:uid/course/:cid", {
      templateUrl: "frontend/templates/coursedetail.html",
      controller: "CourseDetailController",
      controllerAs: "model"
    })
  }

// })();