trainly.factory("apiService", apiService);

function apiService($http) {
  var api = {
    getUserById: getUserById,
    getAllCourses: getAllCourses,
    getEnrolledCoursesByUserId: getEnrolledCoursesByUserId
  };
  return api; 

  function getUserById(uid) {
    var url = '/api/user/' + uid;
    return $http.get(url);
  }

  function getAllCourses() {
    var url = '/api/courses'
    return $http.get(url);
  }

  function getEnrolledCoursesByUserId(uid) {
    var url = '/api/user/' + uid + '/enrolled';
    return $http.get(url);
  }







}