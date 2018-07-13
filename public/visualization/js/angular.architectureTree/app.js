angular.module('ChartsApp', [])
  .run(function(data) {
    data.fetchJsonData().then(function (response) {
      console.log('data loaded');
    }, console.error);
  }).config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });
