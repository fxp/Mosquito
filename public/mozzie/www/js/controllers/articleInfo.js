/**
 * Created by liu on 16-8-2.
 */
appControllers.controller('articleInfoCtrl', function ($scope, LeanCloudClassService, $stateParams, $filter) {
    function init() {
        getArticleInfo();
    }

    function getArticleInfo() {
        LeanCloudClassService.query("Article", {where: {objectId: $stateParams.id}}, function (data) {
            data[0].createdAt = $filter('date')(new Date(data[0].createdAt), "yy/MM/dd");
            $scope.articleInfo = data[0];
        });
    }

    init();
});