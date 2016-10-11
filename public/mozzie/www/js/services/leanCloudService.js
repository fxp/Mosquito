appServices
    .factory("LeanCloudHeaders", function (localStorage) {
        var timestamp = (new Date()).valueOf();
        var sign = md5(timestamp + "Ronj9oBORrmjCDx2HdlhCwr3");
        var filter = localStorage.get('currentUser') == null ? '' : localStorage.get('currentUser').sessionToken;
        return {
            imgHeaders: {
                headers: {
                    "X-LC-Id": "FDCqzaM1bcHHJ80LU36VEIv1-gzGzoHsz",
                    "X-LC-Sign": sign + ',' + timestamp,
                    "Content-Type": "image/jpng"
                }
            },
            headers: function () {

                return {
                    headers: {
                        "X-LC-Id": "FDCqzaM1bcHHJ80LU36VEIv1-gzGzoHsz",
                        "X-LC-Sign": sign + ',' + timestamp,
                        //"X-LC-Session": 'eeflca9td72mklpgdplma639j',
                        "Content-Type": "application/json"
                    }
                };

            }
        };
    })
    .factory('LeanCloudAPI', function () {
        var HOST = "https://api.leancloud.cn";

        var getAPI = function (type) {
            switch (type) {
                case "sms" :
                    return HOST + "/1.1/requestSmsCode";

                case "user":
                    return HOST + "/1.1/usersByMobilePhone";

                case 'img':
                    return HOST + "/1.1/files";

                case "api" :
                    return HOST + "/1.1/classes";
            }
            return false;
        };
        return {
            getAPI: getAPI
        }
    })
    .factory('LeanCloudLoginService', function ($http, LeanCloudAPI, LeanCloudHeaders) {

        return {
            smsVerification: function (data, cb) {
                cb = cb || function () {
                    };
                $http.post(LeanCloudAPI.getAPI("sms"), data, LeanCloudHeaders.headers())
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        alert('发送错误')
                    })
            },
            loginOrRegister: function (data, cb) {
                cb = cb || function () {
                    };
                $http.post(LeanCloudAPI.getAPI("user"), data, LeanCloudHeaders.headers())
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        alert('验证错误');
                    })
            }
        }
    }).factory('LeanCloudClassService', function ($http, LeanCloudAPI, LeanCloudHeaders, $filter) {
        function dateFormat(data) {
            data.forEach(function (item) {
                for (var key in item) {
                    if (key == "createdAt" || key == "updatedAt") {
                        item[key] = $filter('date')(item[key], "yyyy/MM/dd HH:mm:ss");
                    }

                    if (item[key] != null && typeof(item[key]) == 'object' && item[key].iso) {
                        item[key].iso = $filter('date')(item[key].iso, "yyyy/MM/dd HH:mm:ss");
                    }
                }
            });
            return data
        }

        function handelWhere(data) {
            var where_sql = '?';
            var item;
            for (var key in data) {
                if (where_sql != '?') {
                    where_sql += "&"
                }
                if (typeof data[key] == 'object' && data[key]) {
                    item = encodeURIComponent(JSON.stringify(data[key]))
                } else {
                    item = encodeURIComponent(data[key])
                }
                where_sql += key + '=' + item
            }
            return where_sql
        }

        function getFindImgFilter(filter) {
            return {
                where: {
                    user: filter
                },
                order: "-createdAt"
            }
        }

        return {
            create: function (className, data, cb) {
                cb = cb || function () {
                    };
                $http.post(LeanCloudAPI.getAPI('api') + '/' + className, data, LeanCloudHeaders.headers())
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        alert('存储错误')
                    })
            },

            query: function (className, limit, cb) {
                cb = cb || function () {
                    };
                $http.get(LeanCloudAPI.getAPI('api') + '/' + className + handelWhere(limit), LeanCloudHeaders.headers())
                    .success(function (data) {
                        cb(dateFormat(data.results))
                    });
            },

            post: function (data, cb) {
                cb = cb || function () {
                    };
                $http.post("https://leancloud.cn/1.1/installations", data, LeanCloudHeaders.headers())
                    .success(function (data) {
                        alert(JSON.stringify(data))
                    });
            },

            delete: function (className, id, cb) {
                cb = cb || function () {
                    };
                $http.delete(LeanCloudAPI.getAPI('api') + '/' + className + '/' + id, LeanCloudHeaders.headers())
                    .success(function (data) {
                        cb(data);
                    })
                    .error(function () {
                        alert('删除错误，未能删除！')
                    })
            },

            findImg: function (filter, cb) {
                cb = cb || function () {
                    };
                $http.get(LeanCloudAPI.getAPI('api') + "/CameraPosition" + handelWhere(getFindImgFilter(filter)), LeanCloudHeaders.headers())
                    .success(function (data) {
                        cb(dateFormat(data.results));
                    });
            }

        }
    }).factory('FileUpload', function ($http, LeanCloudAPI, LeanCloudHeaders) {
        return {
            upload: function (data, cb) {
                cb = cb || function () {
                    };
                var timestamp = (new Date()).valueOf();

                $http.post(LeanCloudAPI.getAPI('img') + '/' + timestamp, data, LeanCloudHeaders.imgHeaders)
                    .success(function (data) {
                        cb(data);
                    }).error(function () {
                        return alert('上传错误！')
                    });
            }
        }
    }).factory('AndroidUuid', function () {
        return {
            uuid: function () {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                });
                return uuid;
            }
        }
    }).factory('backButton', function ($rootScope, $cordovaToast, localStorage, $ionicPlatform) {
        function exitApp() {
            if ($rootScope.backButtonPressedOnceToExit) {
                localStorage.removeItem("isContainProvince");
                localStorage.removeItem("cityName");
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortTop('再按一次离开');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        }

        return {
            modal: function (check, logout) {
                check = check || function () {
                        return false
                    };
                return $ionicPlatform.registerBackButtonAction(function (event) {

                    if (check()) {
                        logout();
                        return;
                    }
                    exitApp();

                    return false;
                }, 501);
            }
        }
    });

