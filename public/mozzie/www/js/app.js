angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngCordova'])

    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.views.maxCache(0);

        $ionicConfigProvider.backButton.text('').icon('ion-chevron-left');
        $ionicConfigProvider.navBar.alignTitle('center');
    })

    .run(function ($ionicPlatform, $location, $rootScope, $ionicHistory, $cordovaToast, localStorage) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            window.LeanPush.init();

            window.LeanPush.getInstallation(function (data) {
                data = {
                    'deviceType': $scope.isiOS ? 'ios' : 'android'
                };
            }, function (error) {
                alert(error)
            });

            window.LeanPush.onNotificationReceived(function (data) {
                console.log(JSON.stringify(data))
            });

            function backButton() {
                if ($rootScope.backButtonPressedOnceToExit) {
                    localStorage.removeItem("cityName");
                    localStorage.removeItem("isContainProvince");
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortTop('再按一次离开');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }

            $ionicPlatform.registerBackButtonAction(function (event) {

                if ($location.path() == "/login" || $location.path() == "/manage") {
                    backButton();
                    return;

                } else if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }
                return false;
            }, 301);
        });
    });
