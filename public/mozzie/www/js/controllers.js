var appControllers = angular.module('app.controllers', []);
var appServices = angular.module('app.services', []);
var appDirectives = angular.module('app.directives', []);

appControllers.controller('appLoginCtrl', function ($scope, localStorage, CurrentPosition, LeanCloudClassService, JumpPagService, $ionicLoading) {


    $scope.getPosition = function () {
        CurrentPosition.getPositionPoint($scope.isAndroid, function (point, data) {
            $scope.currentPoint = point;
            $scope.takePhotoPosition = data.formattedAddress;
            $scope.currentProvince = data.addressComponent.province;
            $scope.currentAreaName = data.addressComponent.district;
            $scope.$broadcast('currentProvince', point);
        });
    };

    $scope.showSymptom = function () {
        $scope.modalHide = false;
    };

    $scope.hideSymptom = function (data) {
        $scope.modalHide = true;
        $scope.familySymptom = data;
    };

    $scope.hideWelcomePictures = function () {
        document.getElementsByName("welcomeImg")[0].style.display = "none";
    };

    function getUserImg() {
        LeanCloudClassService.findImg({$ne: null}, function (data) {
            data.forEach(function (item) {
                LeanCloudClassService.query("_User", {where: {objectId: item.user.objectId}}, function (userInfo) {
                    item.username = userInfo[0].username
                });
            });
            localStorage.set('imgInfo', data);
        });
    }

    function init() {
        getUserImg();
        $scope.getPosition();

        var userAgent = navigator.userAgent;
        $scope.isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        $scope.isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
        $scope.totalFamilySymptom = ["登革热", "基孔肯雅热", "寨卡病毒病", "黄热病", "流行性乙型脑炎", "疟疾"];
        $scope.modalHide = true;
    }

    init();


    $scope.getCameraOptions = function () {
        return {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        }
    };

    $scope.getLoginStatus = function () {
        var currentUser = localStorage.get('currentUser') || {};
        return currentUser.username != undefined;
    };

    $scope.onDragRight = function () {
        $scope.$ionicGoBack();
    };
});
