/**
 * Created by liu on 16-8-12.
 */
appControllers.controller('currentLocationCtrl', function ($scope, JumpPagService, localStorage) {
    function init() {
        $scope.cityName = ["广东省", "云南省", "广西省", "海南省", "福建省", "浙江省", "上海市"];
    }

    init();

    $scope.setCurrentCity = function (city) {
        localStorage.set("cityName", city);
        JumpPagService.path("/home")
    }
});