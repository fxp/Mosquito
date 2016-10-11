appDirectives.directive("notLoginPage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/loginInfo.html"
    }
}).directive("userCenterPage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/userCenterInfo.html"
    }
}).directive("takePicturePage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/takePictureInfo.html"
    }
}).directive("homePage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/homeInfo.html"
    }
}).directive("articleListPage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/articleListInfo.html"
    }
}).directive("articleInfoPage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/articleInfoPage.html"
    }
}).directive("riskAssessmentPage", function () {
    return {
        restrict: "EA",
        templateUrl: "templates/riskAssessmentInfo.html"
    }
}).directive("assessmentResultsPage", function () {
    return {
        restrict: "EA",
        controller: function (localStorage) {
            function init() {
                var imgHeight = document.getElementById("canvas-preview");
                var textHeight = document.getElementById("preview-textfield");
                prettyPrint();
                initDonut(imgHeight, textHeight);
            }

            init();

            function getOpts(color) {
                return {
                    lines: 120,
                    angle: 0.3,
                    lineWidth: 0.10,
                    limitMax: 'false',
                    colorStart: color,
                    colorStop: color,
                    strokeColor: '#8ae7ee',
                    generateGradient: true
                };
            }

            function initDonut(imgHeight, textHeight) {
                var color = "green";
                if (0 < localStorage.get("postData") && localStorage.get("postData") <= 50) {
                    color = "orange";
                } else if (50 < localStorage.get("postData") && localStorage.get("postData") <= 100) {
                    color = "red"
                }
                var demoGauge = new Donut(imgHeight).setOptions(getOpts(color));
                demoGauge.setTextField(textHeight);
                demoGauge.maxValue = 100;
                demoGauge.animationSpeed = 5;
                demoGauge.set(localStorage.get("postData"));
            }
        },
        templateUrl: "templates/assessmentResultsInfo.html"
    }
});
