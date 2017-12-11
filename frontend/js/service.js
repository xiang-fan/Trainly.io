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
    login: login,
    register: register,
    registerFaculty: registerFaculty,
    registerAdmin: registerAdmin

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

  function register(email, password, fname, lname, street, city, country, zipcode) {
    var url = '/api/register';
    var obj = {email: email, password: password, fname: fname, lname: lname, street: street, city: city, country: country, zipcode: zipcode};
    return $http.put(url, obj);
  }

  function registerFaculty(email, title, affiliation, website) {
    var url = '/api/registerfaculty';
    var obj = {email: email, title: title, affiliation: affiliation, website: website};
    return $http.put(url, obj);
  }

  function registerAdmin(email) {
    var url = '/api/registeradmin';
    var obj = {email: email};
    return $http.put(url, obj);

  }













}