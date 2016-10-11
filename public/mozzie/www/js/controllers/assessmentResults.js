/**
 * Created by liu on 16-8-17.
 */
appControllers.controller('assessmentResultsCtrl', function ($scope, $cordovaToast, JumpPagService, localStorage) {
    $scope.goToNearbyHospital = function () {
        if ($scope.currentPoint == undefined) {
            return $cordovaToast.showShortCenter("请检查GPS是否开启")
        }
        JumpPagService.path("/nearbyHospital");
    };

    var lastPicture = localStorage.get("lastPicture");
    $scope.lastBiteAt = Math.floor((new Date().getTime() - new Date(lastPicture.takePhotoTimeISO).getTime()) / 86400000)// TODO 至今多少天？
    $scope.assessmentAt = new Date(); //TODO save assessment and retrieve it
});