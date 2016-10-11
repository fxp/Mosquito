/**
 * Created by liu on 16-7-22.
 */
appControllers.controller('userCenterCtrl', function ($scope, JumpPagService, localStorage, $ionicLoading,$http, $timeout, $cordovaToast, $location) {
    function init() {
        $scope.userName = localStorage.get("currentUser").username;
    }

    init();

    $scope.goToLogin = function () {
        JumpPagService.path("/login");
        localStorage.removeItem("currentUser");
    };

    $scope.feedback = function () {
        cordova.InAppBrowser.open('http://form.mikecrm.com/PvLdAS', '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
    };

    $scope.aboutUs = function () {
        cordova.InAppBrowser.open('http://www.chinacdc.cn/', '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
    };

    $scope.clearCache = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        $timeout(function () {
            $cordovaToast.showShortCenter("已经清除");
            $ionicLoading.hide();
        }, 2000);
    };

    $scope.goToHome = function () {
        JumpPagService.path("/home");
    }
});