/**
 * Created by liu on 16-7-21.
 */
angular.module('app.routes', [])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('manage', {
                url: '/manage',
                templateUrl: 'templates/manage.html',
                cache: 'false',
                controller: 'manageCtrl',
                resolve: {
                    users: function (JumpPagService, localStorage) {
                        if (localStorage.get('imgInfo') == undefined) {
                            JumpPagService.path('/login')
                        }
                    }
                }
            })

            .state('manageImg', {
                url: '/manageImg',
                templateUrl: 'templates/manageImg.html',
                cache: 'false',
                controller: 'manageImgCtrl',
                params: {"id": {}}
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                cache: 'false',
                controller: 'loginCtrl'
            })

            .state('userCenter', {
                url: '/userCenter',
                templateUrl: 'templates/userCenter.html',
                cache: 'false',
                controller: 'userCenterCtrl'
            })

            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                cache: 'false',
                controller: 'homeCtrl',
                params: {
                    openInsects123: false
                }
            })

            .state('takePicture', {
                url: '/takePicture',
                templateUrl: 'templates/takePicture.html',
                cache: 'false',
                controller: 'takePictureCtrl',
                params: {"img": {}}
            })

            .state('articleList', {
                url: '/articleList',
                templateUrl: 'templates/articleList.html',
                cache: 'false',
                controller: 'articleListCtrl',
                params: {"type": {}}
            })

            .state('articleInfo', {
                url: '/articleInfo',
                templateUrl: 'templates/articleInfo.html',
                cache: 'false',
                controller: 'articleInfoCtrl',
                params: {"id": {}}
            })

            .state('articleInfo.detail', {
                url: "/:id",
                cache: 'false',
                templateUrl: 'templates/articleInfo.html'
            })

            .state('currentLocation', {
                url: '/currentLocation',
                templateUrl: 'templates/currentLocation.html',
                cache: 'false',
                controller: 'currentLocationCtrl'
            })

            .state('riskAssessment', {
                url: '/riskAssessment',
                templateUrl: 'templates/riskAssessment.html',
                cache: 'false',
                controller: 'riskAssessmentCtrl'
            })

            .state('assessmentResults', {
                url: '/assessmentResults',
                templateUrl: 'templates/assessmentResults.html',
                cache: 'false',
                controller: 'assessmentResultsCtrl'
            })

            .state('nearbyHospital', {
                url: '/nearbyHospital',
                templateUrl: 'templates/nearbyHospital.html',
                cache: 'false',
                controller: 'nearbyHospitalCtrl'
            });

        $urlRouterProvider.otherwise('/home')
    });
