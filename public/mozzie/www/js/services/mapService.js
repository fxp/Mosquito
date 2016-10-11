/**
 * Created by liu on 16-8-29.
 */
appServices
    .factory("CurrentPosition", function ($ionicLoading, $cordovaGeolocation) {
        return {
            getPositionPoint: function (isAndroid, cb) {
                if (isAndroid) {
                    baidu_location.getCurrentPosition(function (position) {
                        alert(JSON.stringify(position));
                    }, function (err) {
                        alert(JSON.stringify(err));
                    });
                } else {
                    var posOptions = {timeout: 10000, enableHighAccuracy: false};
                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                        AMap.service('AMap.Geocoder', function () {
                            var geocoder = new AMap.Geocoder({
                                city: "010"
                            });

                            var lnglatXY = [position.coords.longitude, position.coords.latitude];
                            geocoder.getAddress(lnglatXY, function (status, result) {
                                if (status === 'complete' && result.info === 'OK') {
                                    cb(position.coords, result.regeocode)
                                } else {
                                    console.log('定位失败');
                                }
                            });
                        });
                    }, function (error) {
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                console.log("用户拒绝对获取地理位置的请求。");
                                break;
                            case error.POSITION_UNAVAILABLE:
                                console.log("位置信息是不可用的。");
                                break;
                            case error.TIMEOUT:
                                console.log("请求地理位置超时, 请检查GPS是否开启");
                                break;
                            case error.UNKNOWN_ERROR:
                                console.log("未知错误。");
                                break;
                        }
                    });
                }
            }
        }
    });
