/**
 * Created by liu on 16-8-18.
 */
appControllers.controller('nearbyHospitalCtrl', function ($scope, JumpPagService, $timeout) {
    $scope.goToAssessmentResults = function () {
        document.getElementById("nearbyHospitalTop").className = " animated fadeOutDown pane";
        $timeout(function () {
            JumpPagService.path("/assessmentResults");
        }, 500);
    };


    function init() {
        document.getElementById("allmap").style.height = (document.body.scrollHeight - document.body.scrollHeight * 0.7 + 43) + "px";
    }

    init();
});