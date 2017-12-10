var trainly = angular.module("trainly", ['ngRoute', 'ui.bootstrap']);

trainly.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://www.youtube.com/**'
  ]);
});