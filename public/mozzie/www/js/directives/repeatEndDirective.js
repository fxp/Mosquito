/**
 * Created by liu on 16-8-29.
 */
appDirectives.directive("repeatEnd", function () {
    return {
        restrict: "EA",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
});