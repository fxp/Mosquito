/**
 * Created by liu on 16-7-22.
 */
appControllers.controller("homeCtrl", function ($rootScope, $scope, $ionicModal, $stateParams, $ionicSlideBoxDelegate, $http, $cordovaToast, localStorage, backButton, LeanCloudClassService, $state, JumpPagService, $cordovaCamera) {

    $scope.showMozzinfo = function () {
        $ionicModal.fromTemplateUrl("templates/maybeMozzieModal.html", {
            scope: $scope,
            animation: "slide-in-left", //modal弹出动画
            hardwareBackButtonClose: true
        }).then(function (modal) {
            $scope.modal = modal;
            var lastPicture = localStorage.get('lastPicture');
            $http.post("https://leancloud.cn/1.1/functions/insect_statistic", {
                lat: lastPicture.imgCoordinate.latitude,
                lon: lastPicture.imgCoordinate.longitude,
                time: lastPicture.takePhotoTimeISO
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-LC-Id": "FDCqzaM1bcHHJ80LU36VEIv1-gzGzoHsz",
                    "X-LC-Key": "Ronj9oBORrmjCDx2HdlhCwr3"
                }
            }).success(function (data) {
                $scope.mozzieInfo = data.result.insects;
                $scope.imgUrl = localStorage.get("imgURL");
                $scope.modal.show();
            }).error(function (err) {
                return $cordovaToast.showShortCenter("上传失败");
            });

        });
    };
    if (localStorage.get("showMozzinfo") == true) {
        $scope.showMozzinfo();
        localStorage.set("showMozzinfo", false);
    }

    $scope.showModal = function () {
        localStorage.removeItem("lastPage");
        localStorage.removeItem("imgURL");
        $scope.modal.show();
        localStorage.set("modal", $scope.modal.isShown())
    };

    function isModalShow() {
        return localStorage.get("modal") == true;
    }

    $scope.hideModal = function () {
        localStorage.removeItem("modal");
        $scope.modal.remove();
    };

    function setBuckButton(backButtonModal) {
        $scope.$on("$destroy", function () {
            backButtonModal();
        });
        localStorage.removeItem("modal");
    }

    function init() {
        var backButtonModal = backButton.modal(isModalShow, function () {
            // $scope.modal.remove();
            setBuckButton(backButtonModal);
        });
        setBuckButton(backButtonModal);

        getCityName();
        postNewInfo();
        getNumberOfPeople();
        $scope.isContainProvince = localStorage.get('isContainProvince');

        if (localStorage.get('isContainProvince') === null) {
            $scope.isContainProvince = true
        }
    }

    $scope.$on("currentProvince", function (event, data) {
        $http.post("https://leancloud.cn/1.1/functions/is_available", {lat: data.latitude, lon: data.longitude}, {
            headers: {
                "Content-Type": "application/json",
                "X-LC-Id": "FDCqzaM1bcHHJ80LU36VEIv1-gzGzoHsz",
                "X-LC-Key": "Ronj9oBORrmjCDx2HdlhCwr3"
            }
        }).success(function (data) {
            localStorage.set('isContainProvince', !data.result.valid);
            $scope.isContainProvince = !data.result.valid;
        });
    });

    init();

    function getNumberOfPeople() {
        var data = {where: {objectId: "57baaba7165abd006624d642"}};
        LeanCloudClassService.query("NumberOfPeople", data, function (data) {
            $scope.numberOfPeople = data[0].number;
        })
    }

    function getCityName() {
        var currentCity = localStorage.get("cityName");
        var include = ["", "广东省", "云南省", "广西省", "海南省", "福建省", "浙江省", "上海市"];//todo
        if (currentCity != null && include.indexOf(currentCity)) {
            $scope.isContainProvince = false;
        } else {
            $scope.isContainProvince = true;
        }
        if (currentCity) {
            $scope.currentProvince = currentCity;
        }
    }


    $scope.goToUserCenter = function () {
        return $scope.getLoginStatus() ? JumpPagService.path("/userCenter") : JumpPagService.path("/login");
        // return $scope.getLoginStatus() ? $state.go("userCenter") : $state.go("login");
    };

    $scope.goToCurrentLocation = function () {
        JumpPagService.path("/currentLocation");
    };

    $scope.goToRiskAssessment = function () {
        if ($scope.isContainProvince) {
            return $cordovaToast.showShortCenter("暂时不支持该地区")
        }
        if ($scope.getLoginStatus()) {
            var query = {
                "__type": "Pointer",
                "className": "_User",
                "objectId": localStorage.get("currentUser").objectId
            };
            LeanCloudClassService.findImg(query, function (data) {
                if (data.length === 0) {
                    $cordovaToast.showShortCenter("您还尚未上传过图片");
                } else {
                    localStorage.set("lastPicture", {takePhotoTimeISO: data[0].createdAt});
                    JumpPagService.path("/riskAssessment");
                }
            });
        } else {
            JumpPagService.path("/login")
        }
    };

    $scope.goToArticleList = function (type) {
        $state.go("articleList", {type: type});
    };


    function postNewInfo() {
        //var appId = "FDCqzaM1bcHHJ80LU36VEIv1-gzGzoHsz";
        //var appKey = "Ronj9oBORrmjCDx2HdlhCwr3";
        //var push = AV.push({
        //    appId: appId,
        //    appKey: appKey
        //});
        //
        //push.send({
        //    data: {LeanCloud: 123}
        //}, function (result) {
        //    if (result) {
        //        console.log("推送成功发送");
        //    } else {
        //        alert("error");
        //    }
        //});
    }

    $scope.takePhoto = function () {
        if ($scope.isContainProvince) {
            return $cordovaToast.showShortCenter("暂时不支持该地区")
        }
        $cordovaCamera.getPicture($scope.getCameraOptions()).then(function (imageData) {
            JumpPagService.path("/takePicture");
            localStorage.set("imgURL", "data:image/jpeg;base64," + imageData);
        });
    };

    $scope.nextSlide = function () {
        $ionicSlideBoxDelegate.next();
    };

    $scope.lastSlide = function () {
        $ionicSlideBoxDelegate.previous();
    }
});