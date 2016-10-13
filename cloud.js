var AV = require('leanengine');

var unirest = require("unirest");
var Promise = require('promise');

var coordtransform = require('coordtransform');

var _ = require("underscore");

function getProvince(lat, lon) {
    return new Promise(function (fulfill, reject) {
        var req = unirest("GET", "http://api.map.baidu.com/cloudrgc/v1?location=" + lat + "," + lon);
        var location = lat + "," + lon;
        req.query({
            "geotable_id": "1",
            "coord_type": "bd09ll",
            "ak": "VKxmPFuviR4uzakcK5ZW5GXAxeAfIbsK"
        });
        req.end(function (res) {
            if (res.error) {
                reject(res.error);
            } else {
                if (res.body && res.body.status == 0) {
                    fulfill(res.body.address_component.province);
                } else {
                    reject(res.body);
                }
            }
        });
    })
}

var DISEASE = {
    "流行性乙型脑炎": {
        content: "是由嗜神经的乙脑病毒所致的中枢神经系统性传染病。本病主要分布在亚洲远东和东南亚地区，经蚊传播，多见于夏秋季，临床上急起发病，有高热、意识障碍、惊厥、强直性痉挛和脑膜刺激征等，重型患者病后往往留有后遗症。"
    },
    "登革热": {
        content: "登革热（dengue fever）是登革热病毒引起、伊蚊传播的一种急性传染病。临床特征为起病急骤，高热，全身肌肉、骨髓及关节痛，极度疲乏，部分患可有皮疹、出血倾向和淋巴结肿大。应做好疫情监测，以便及时采取措施控制扩散。患者发病最初5天应防止其受蚊类叮咬，以免传播。典型患者只占传染源的一小部分，所以单纯隔离患者不足以制止流行。预防措施的重点在于防蚊和灭蚊。应动员群众实行翻盆倒罐，填堵竹、树洞。对饮用水缸要加盖防蚊，勤换水，并在缸内放养食蚊鱼。室内成蚊可用敌敌畏喷洒消灭，室外成蚊可用50%马拉硫磷、杀螟松等作超低容量喷雾，或在重点区域进行广泛的药物喷洒。登革热的预防接种目前还处于研究阶段，不能用于疫区。"
    },
    "基孔肯雅热": {
        content: "基孔肯雅热是由基孔肯雅病毒引起的一种急性传染病。基孔肯雅病毒属披膜病毒, 蚊子为传染媒介。该病是一种自然疫源性疾病, 传染源主要是受感染的动物宿主和病人。基孔肯雅病毒的动物宿主有绿猴、狒狒、黑猩猩、牛、马、猪、兔等。主要传播途径是蚊虫吸血传播, 能传播基孔肯雅的蚊虫有埃及伊蚊、非洲曼蚊、非洲伊蚊、棕翅曼蚊等。此外, 本病还可经呼吸道传播。经过3～1 2 天的潜伏期, 感染者即可发病。"
    },
    "寨卡病毒病": {
        content: "寨卡病毒病是由寨卡病毒引起的一种急性病毒性疾病，主要通过蚊子叮咬传播，一般症状较轻，2-7天自愈，重症及死亡病例罕见。"
    },
    "黄热病": {
        content: "病毒在体内潜伏期为3至6天，随后出现感染症状。第一期也称“急性期”，通常表现为发热、肌肉疼痛（尤其是背痛）、头痛、寒战、食欲不振、恶心和呕吐。3至4天之后，多数病人会出现好转，症状随之消失。"
    },
    "流行性乙型脑炎": {
        content: "乙脑病毒属于虫媒病毒黄病毒科黄病毒属。毒粒为球形，有包膜，直径20-30nm，为二十面体结构。基因是正链单股RNA，包装于病毒核衣壳中，外层为脂膜（包膜）。包膜中有糖基化蛋白E和非糖基化蛋白M。E蛋白是主要抗原成分，具有特异性中和以及血凝抑制抗原决定簇。乙脑病毒加热至56℃30分钟即可灭活。来苏水对该病有很强的灭活作用（1% 5分钟，或5% 1分钟即可灭活）。"
    },
    "疟疾": {
        content: "疟疾潜伏期因感染的疟原虫种类不同而异。恶性疟平均为12天，三日疟平均30天，间日疟和卵形疟平均14天，但间日疟有时可长达12个月以上。经输血传播的疟疾，其潜伏期的长短与血中疟原虫的数量有关，3－41天不等，一般为7－14天。疟疾临床症状通常有以下四期"
    },
}


var INSECT_DISEASE = {
    "致倦库蚊": ["登革热", "寨卡病毒病", "流行性乙型脑炎"],
    "白纹伊蚊": ["登革热", "基孔肯雅热", "寨卡病毒病", "黄热病", "流行性乙型脑炎"],
    "三带喙库蚊": ["流行性乙型脑炎"],
    "中华按蚊": ["疟疾"]
}


var SYMPTOM_DISEASE = {
    "发热": ["登革热", "流行性乙脑", "疟疾", "基孔肯雅热", "寨卡病毒病", "黄热病"],
    "头痛": ["流行性乙脑", "疟疾", "基孔肯雅热", "寨卡病毒病", "黄热病"],
    "头痛伴眼眶痛": ["登革热"],
    "肌肉酸痛": ["登革热", "寨卡病毒病"],
    "骨关节痛": ["登革热", "基孔肯雅热", "寨卡病毒病"],
    "皮疹": ["登革热", "基孔肯雅热", "寨卡病毒病"],
    "出血": ["登革热"],
    "恶心": ["基孔肯雅热"],
    "呕吐": ["流行性乙脑", "基孔肯雅热"],
    "结膜炎": ["寨卡病毒病"],
    "全身乏力": ["寨卡病毒病"],
    "寒战": ["黄热病"],
    "烦躁": ["流行性乙脑"],
    "意识障碍": ["流行性乙脑"],
    "惊厥": ["流行性乙脑"],
    "周期性发冷发热": ["疟疾"],
    "出汗": ["疟疾"],
}

var DISEASE_INCUBATION_DAYS = {
    "登革热": 20,
    "基孔肯雅热": 15,
    "寨卡病毒病": 15,
    "黄热病": 10,
    "流行性乙脑": 25,
    "疟疾": 30
}

function diagnose(lat, lon, time, symptoms, family_disease, lastPicture) {
    return new Promise(function (fulfill, reject) {
        var t = new Date(time);
        if (t == 'Invalid Date') {
            reject('invalid date');
            return;
        }
        console.log(t);
        getProvince(lat, lon)
            .then(function (province) {
                var querys = new AV.Query('VaidProvinces');
                querys.equalTo('provinces_name', province);
                return querys.find().then(function (results) {
                    var provinces_item = results[0];
                    if (provinces_item) {
                        var minCount = t.getHours() * 60 + t.getMinutes();
                        console.log(provinces_item.get('start').start_hour);
                        // console.log((provinces_item.get('start_hour') * 60 + provinces_item.get('start_min')));
                        // console.log("minCount:" + minCount);
                        if (minCount > (provinces_item.get('start').start_hour * 60 + provinces_item.get('start').start_min) &&
                            minCount < (provinces_item.get('end').end_hour * 60 + provinces_item.get('end').end_min)) {
                            console.log('DAY diseaseRate:' + provinces_item.attributes.diseaseRate);
                            return Promise.resolve({
                                mozRiskRate: provinces_item.attributes.dayRiskRate,
                                diseaseRate: provinces_item.attributes.diseaseRate
                            });
                        } else {
                            console.log('NIGHT diseaseRate:' + provinces_item.attributes.diseaseRate);
                            return Promise.resolve({
                                mozRiskRate: provinces_item.attributes.nightRiskRate,
                                diseaseRate: provinces_item.attributes.diseaseRate
                            });
                        }
                    } else {
                        reject('invalid location');
                        return;
                    }
                }, function (error) {
                    console.log(error)
                    reject('invalid location');
                });
            })
            .then(function (rates) {
                var result;
                var dRate = (rates.diseaseRate * 100000) * 40;
                dRate = (dRate > 40) ? 40 : dRate;
                console.log("dRate:" + dRate);
                console.log("rates.mozRiskRate:" + rates.mozRiskRate);
                if (typeof family_disease != 'undefined') {
                    result = 40 - dRate * 0.8 + rates.mozRiskRate * 35 + 25;
                } else {
                    result = (dRate + rates.mozRiskRate * 35 + 25);
                    if (symptoms.indexOf("无以上症状") >= 0) {
                        result = result * 0.2;
                    } else {
                        var diseases = [];
                        _.each(symptoms, function (s) {
                            diseases = _.union(SYMPTOM_DISEASE[s], diseases);
                        })
                        var max_incubation_days = 0;
                        _.each(diseases, function (d) {
                            if (max_incubation_days < DISEASE_INCUBATION_DAYS[d]) {
                                max_incubation_days = DISEASE_INCUBATION_DAYS[d];
                            }
                        })

                        var lastPictureBeforeDays = Math.ceil((new Date() - lastPicture) / 1000 / 60 / 60 / 24);
                        var inIncubationPeriod = (lastPictureBeforeDays < max_incubation_days);

                        if (inIncubationPeriod) {
                            console.log("潜伏期," + result);
                            result = result * 1;
                        } else {
                            console.log("非潜伏期," + result);
                            result = (symptoms && symptoms.length > 0) ? result * 0.5 : result * 0.2;
                        }
                    }
                }
                result = Math.round(result);
                fulfill(result);
            }, function (err) {
                reject(err);
            })
        if (symptoms && symptoms.length == 0) {

        }
    });
}

function insect_statistic(lat, lon, time) {
    return new Promise(function (fulfill, reject) {
        var t = new Date(time);
        if (t == 'Invalid Date') {
            reject('invalid date');
        } else {
            getProvince(lat, lon)
                .then(function (province) {
                    console.log(province);
                    var querys = new AV.Query('VaidProvinces');
                    querys.find().then(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            var provinces_item = results[i];
                            if (province == provinces_item.attributes.provinces_name || (provinces_item.attributes.provinces_name != province && i == (results.length - 1))) {
                                var minCount = t.getHours() * 60 + t.getMinutes();
                                if (minCount > (provinces_item.attributes.start.start_hour * 60 + provinces_item.attributes.start.start_min) &&
                                    minCount < (provinces_item.attributes.end.end_hour * 60 + provinces_item.attributes.end.end_min)) {
                                    fulfill(provinces_item.attributes.insects[t.getMonth() + 1].city_day);
                                } else {
                                    fulfill(provinces_item.attributes.insects[t.getMonth() + 1].city_night);
                                }
                                break;
                            }
                        }
                    }, function (error) {
                        console.log('i')
                        console.log(error)
                    })
                })
        }

    })
}

function getIllness(insect) {
    if (INSECT_DISEASE[insect]) {
        var result = [];
        var insectDiseases = INSECT_DISEASE[insect];
        _.each(insectDiseases, function (disease) {
            result.push({
                title: disease,
                content: DISEASE[disease].content
            })
        })
        return result;
    } else {
        return undefined;
    }
}

AV.Cloud.define('insect_statistic', function (request, response) {
    var lat = request.params.lat,
        lon = request.params.lon,
        time = request.params.time;
    console.log('insect_statistic', JSON.stringify(request.params));
    insect_statistic(lat, lon, time)
        .then(function (insects) {
            var result = [];
            var querys = new AV.Query('Insect');
            querys.find().then(function (results) {
                for (var j = 0; j < results.length; j++) {
                    var a = results[j]
                    for (var i in insects) {
                        //if (INSECTS[i])10.8.11
                        if (i == a.attributes.name) {
                            result.push({
                                name: i,
                                img: a.attributes.img,
                                illness: a.attributes.illness,
                                // illness: getIllness(i),
                                chance: insects[i]
                            });
                        }
                    }
                }
                response.success({
                    // insects: result
                    insects: _.sortBy(result, 'chance').reverse().slice(0, 3)
                });
            }, function (error) {
                console.log(error)
            })
        }, function (err) {
            console.log('2')
            response.error(err);
        })
});

AV.Cloud.define('is_available', function (request, response) {
    //console.log('is_available,' + JSON.stringify(request.params));10.8.11
    getProvince(request.params.lat, request.params.lon)
        .then(function (result) {
            var querys = new AV.Query('VaidProvinces');
            querys.equalTo('provinces_name', result);
            querys.find().then(function (results) {
                if (results[0] != undefined) {
                    response.success({
                        valid: true
                    })
                } else {
                    response.success({
                        valid: false
                    })
                }
            }, function (error) {
                response.error(error)
            })

        }, function (err) {
            response.success({
                valid: false,
                error: err
            })
        })
});

var dateFormat = require('dateformat');

var getSuggestion = function (grade, symptoms, family_disease, last_picture_at) {
    var t = dateFormat(last_picture_at, "yyyy-MM-d H:m:s");
    if (symptoms.length == 1 && symptoms[0] == '无以上症状' && family_disease.length == 0) {
        return "根据" + t + "上传的蚊子叮咬部位图片，结合本地区传染病流行风险，建议继续自我观察，如出现上述症状请再次评估。";
    } else if (symptoms.length == 1 && symptoms[0] == '无以上症状' && family_disease.length > 0) {
        return "根据" + t + "上传的蚊子叮咬部位图片，结合本地区传染病流行风险以及共同居住的家人已有" + family_disease[0] + "发病，建议继续自我观察，如出现上述症状请及时到医院就诊。";
    } else if (grade > 0 && grade <= 25) {
        return "根据" + t + "上传的蚊子叮咬部位图片，结合当前症状和本地区传染病流行风险，建议继续自我观察，如出现症状加重应及时到医院就诊。"
    } else if (grade > 25 && grade <= 50) {
        return "根据" + t + "上传的蚊子叮咬部位图片，结合当前症状和本地区传染病流行风险，尚不能排除感染蚊传疾病的风险。建议到医院就诊，做进一步诊断治疗。"
    } else if (grade > 50 && grade <= 75) {
        return "根据" + t + "上传的蚊子叮咬部位图片，结合当前症状和本地区传染病流行风险，尚不能排除感染蚊传疾病的风险。建议及时到医院就诊，做进一步诊断治疗。"
    } else if (grade > 75 && grade <= 100) {
        return "根据" + t + "上传的蚊子叮咬部位图片，结合当前症状和本地区传染病流行风险以及共同居住的家人已有XX发病，感染同样传染病的风险程度较高。建议立即到医院就诊，做进一步诊断治疗。"
    } else {
        return "根据2016-08-10 10:58:11上传的蚊子叮咬部位图片，结合本地区传染病流行风险，建议继续自我观察，如出现上述症状请再次评估。测试失败";
    }
}

AV.Cloud.define('get_grade', function (request, response) {
    // console.log('get_grade', JSON.stringify(request.params));10.8.11
    //diagnose(22.8155, 108.3275, '2016-09-26T14:25:44.388Z',['123'], '123')
    console.log(request.params);
    // TODO modify this
    var user_id = request.params.user_id || "57ed237eda2f60004f488d7e";
    var query = new AV.Query('CameraPosition');
    query.equalTo('user', AV.Object.createWithoutData('_User', user_id));
    query.descending('createdAt');
    query.find().then(function (results) {
        var lastPictureAt = new Date();
        if (results.length > 0) {
            lastPictureAt = results[0].get('createdAt');
        }
        var symptoms = request.params.symptoms || [];
        var family_disease = request.params.family_disease || [];

        console.log('lastPictureAt,' + lastPictureAt);
        diagnose(request.params.lat, request.params.lon, request.params.time,
            symptoms, family_disease, lastPictureAt)
            .then(function (result) {
                var suggestion = getSuggestion(result, symptoms, family_disease, lastPictureAt);
                console.log('su' + suggestion);
                response.success({
                    risk_rate: result,
                    last_pictured_at: results[0].get('createdAt'),
                    suggestion: suggestion
                });
            }, function (err) {
                response.error(err);
            })
    }, function (err) {
        response.error(err);
    })
});

function changeCoordinate(lon, lat, original, target) {
    return new Promise(function (fulfill, reject) {
        if (original == 'bd09' && target == 'wgs84') {
            console.log('3')
            var coord = coordtransform.bd09togcj02(lon, lat);//百度经纬度坐标转国测局坐标
            var target_coordinate = coordtransform.gcj02towgs84(coord[0], coord[1]);//国测局坐标转wgs84坐标
            console.log(target_coordinate)
        }
        else if (original == 'wgs84' && target == 'bd09') {
            console.log('4')
            var coord = coordtransform.wgs84togcj02(lon, lat);//wgs84转国测局坐标
            var target_coordinate = coordtransform.gcj02tobd09(coord[0], coord[1]);//国测局坐标转百度坐标
        }
        else {
            var originaltarget = original + 'to' + target
            var target_coordinate = coordtransform[originaltarget](lon, lat);
        }
        fulfill(target_coordinate);
    })
}

AV.Cloud.define('is_login', function (request, response) {
    if (request.currentUser) {
        response.success(true);
    } else {
        response.success(false);
    }
})

AV.Cloud.define('transformation_coordinate', function (request, response) {
    var lat = 38.00541012868753,
        lon = 114.51368950957637,
        original = 'gcj02',
        target = 'wgs84';
    changeCoordinate(lon, lat, original, target).then(function (result) {
        response.success(result);
    }, function (error) {
        response.success(error)
    });
});

AV.Cloud.afterSave('CameraPosition', function (request, response) {
    var query = new AV.Query('NumberOfPeople');
    query.get('57baaba7165abd006624d642').then(function (data) {
        var num = data.attributes.number;
        var update = AV.Object.createWithoutData('NumberOfPeople', '57baaba7165abd006624d642');
        update.set('number', num + 1);
        update.save();
    }, function (error) {
        alert('错误')
    });
});

module.exports = AV.Cloud;
