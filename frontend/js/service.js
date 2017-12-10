trainly.factory("apiService", apiService);

function apiService($http) {
  var api = {
    getUserById: getUserById,
    getAllCourses: getAllCourses,
    getEnrolledCoursesByUserId: getEnrolledCoursesByUserId,
    interestACourse: interestACourse,
    disinterestCourse: disinterestCourse,
    getMyCourses: getMyCourses,
    getMyInterestedCourses: getMyInterestedCourses
  };
  return api; 

  function getUserById(uid) {
    var url = '/api/user/' + uid;
    return $http.get(url);
  }
 
  function getAllCourses(uid) {
    var url = '/api/user/' + uid + '/courses'
    return $http.get(url);
  }

  function getEnrolledCoursesByUserId(uid) {
    var url = '/api/user/' + uid + '/enrolled';
    return $http.get(url);
  }

  function interestACourse(uid, cid) {
    var url = '/api/interestcourse'
    var obj = {uid: uid, cid: cid}
    return $http.put(url, obj);
  }

  function disinterestCourse(uid, cid) {
    var url = '/api/disinterestcourse'
    var obj = {uid: uid, cid: cid}
    return $http.put(url, obj);
  }

  function getMyCourses(uid) {
    var url = '/api/user/' + uid + '/mycourses'
    return $http.get(url);
  }

  function getMyInterestedCourses(uid) {
    var url = '/api/user/' + uid + '/myinterestedcourses'
    return $http.get(url);
  }









}