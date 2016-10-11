/**
 * Created by liu on 16-8-2.
 */
appControllers.controller('articleListCtrl', function ($scope, LeanCloudClassService, $state, $stateParams, $filter) {
    function init() {
        $scope.headerText = $stateParams.type;
        getArticleList();
    }

    init();

    function getArticleList() {
        LeanCloudClassService.query("Article", {where: {type: $scope.headerText}}, function (data) {
            data.forEach(function (item) {
                item.createdAt = $filter('date')(new Date(item.createdAt), "yy/MM/dd");
            });
            $scope.articleInfo = data;
        })
    }

    $scope.goToArticleInfo = function (id) {
        $state.go('articleInfo.detail', {id: id.objectId});
    };

});