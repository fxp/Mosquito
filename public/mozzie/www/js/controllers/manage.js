/**
 * Created by liu on 16-8-25.
 */
appControllers.controller('manageCtrl', function ($scope, LeanCloudClassService, $cordovaToast, $state, localStorage, $ionicScrollDelegate, $window) {

    function getTotalUser() {
        LeanCloudClassService.query("_User", {where: {objectId: {$nin: [localStorage.get("currentUser").objectId]}}}, function (data) {
            $scope.userInfo = data
        })
    }

    $scope.paginationConf = {
        currentPage: 1,
        totalItems: localStorage.get('imgInfo').length,
        itemsPerPage: 2,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $ionicScrollDelegate.scrollTop(false);
            var page = $scope.paginationConf.currentPage;
            $scope.imgInfo = localStorage.get('imgInfo').slice((page - 1) * 2, page * 2);
        }
    };

    function init() {
        getTotalUser();
    }

    init();

    $scope.deleteImg = function (id) {
        LeanCloudClassService.delete("CameraPosition", id, function (data) {
            $window.location.reload();
            $cordovaToast.showShortCenter("已删除");
        })
    };

    $scope.goToManageImg = function (id) {
        $state.go('manageImg', {id: id});
    };
});