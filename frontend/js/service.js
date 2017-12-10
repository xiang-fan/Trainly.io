trainly.factory("apiService", apiService);

function apiService($http) {
  var api = {
    getUserById: getUserById,
    getAllCourses: getAllCourses,
    getEnrolledCoursesByUserId: getEnrolledCoursesByUserId,
    enrollCourse: enrollCourse,
    interestACourse: interestACourse,
    disinterestCourse: disinterestCourse,
    getMyCourses: getMyCourses,
    getMyInterestedCourses: getMyInterestedCourses,
    getIncompletedMaterials: getIncompletedMaterials,
    getCompletedMaterials: getCompletedMaterials,
    completeMaterial: completeMaterial,
    getProgress: getProgress,
    completeCourse: completeCourse,
    login: login
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

  function enrollCourse(uid, cid) {
    var url = '/api/enrollcourse'
    var obj = {uid: uid, cid: cid}
    return $http.put(url, obj);
  }

  function interestACourse(uid, cid) {
    var url = '/api/interestcourse'
    var obj = {uid: uid, cid: cid}
    return $http.put(url, obj);
  }

  function disinterestCourse(uid, cid) {
    var url = '/api/disinterestcourse';
    var obj = {uid: uid, cid: cid};
    return $http.put(url, obj);
  }

  function getMyCourses(uid) {
    var url = '/api/user/' + uid + '/mycourses';
    return $http.get(url);
  }

  function getMyInterestedCourses(uid) {
    var url = '/api/user/' + uid + '/myinterestedcourses'
    return $http.get(url);
  }

  function getIncompletedMaterials(uid, cid) {
    var url = '/api/user/' + uid +'/course/' + cid + '/incompleted';
    return $http.get(url);
  }

  function getCompletedMaterials(uid, cid) {
    var url = '/api/user/' + uid +'/course/' + cid + '/completed';
    return $http.get(url);
  }

  function completeMaterial(uid, mid) {
    var url = '/api/completematerial';
    console.log(mid);
    var obj = {uid: uid, mid: mid};
    return $http.put(url, obj);
  }

  function getProgress(uid, cid) {
    var url = '/api/user/' + uid +'/course/' + cid + '/progress';
    return $http.get(url);
  }

  function completeCourse(uid, cid) {
    var url = '/api/completecourse';
    var obj = {uid: uid, cid: cid};
    return $http.put(url, obj);
  }

  function login(username, password) {
    var url = '/api/login';
    var obj = {username: username, password: password};
    return $http.put(url, obj);
  }













}