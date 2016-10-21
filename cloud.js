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
                    if (res.body.address_component && res.body.address_component.province) {
                        fulfill(res.body.address_component.province);
                    } else {
                        fulfill(undefined);
                    }
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

var INSECT_INFO = {
    "致倦库蚊": "<p>淡色库蚊和致倦库蚊又是最常见的“家蚊”，大致以北纬33°为界，淡色库蚊分布在33°以北，致倦库蚊分布在33°以南，而南北交界的江苏、浙江、安徽、湖北、陕西等省两种均有。</p><p>淡色库蚊主要孳生于人居附近中度污染的积水中。城市里的污水池、臭水沟、化粪池、雨水井积水、下水道积水、浇花用的肥水缸、 建筑工地坑洼积水是这种蚊虫的重要孳生场所。</p> <p>淡色库蚊已被证实为我国北方地区吸血骚扰的主要蚊种和班氏丝虫的主要媒介，也可感染马来丝虫，但感染率较低。</p>",
    "白纹伊蚊": "<p>白纹伊蚊也被称为亚洲虎蚊，源于东南亚，是东南亚和中国的常见蚊种。首先是登革热的重要媒介。同时实验室感染表明，通过刺叮还能传播黄热病、西马脑炎、委内瑞拉马脑炎、西尼罗、罗斯河热、基孔肯雅热、寨卡病毒病等多种病毒性疾病，是传播病毒性疾病的潜在性媒介。</p><p>白纹伊蚊刺叮凶猛异常，刺叮后皮肤奇痒、可引起皮肤红肿，局部皮炎，甚至全身性皮炎，抓破后易溃痒感染。</p><h3>登革热</h3><p>我国登革热的传播媒介是埃及伊蚊和白纹伊蚊，二者体色都为黑色，被称为“花蚊子”。临床症状为突然发热，全身肌肉、骨、关节痛，极度疲乏，皮疹，淋巴结肿大及白细胞减少。登革热的预防接种目前还处于研究阶段，不能用于疫区。</p><h3>黄热病</h3><p>不同种类的伊蚊和趋血蚊种可传播该病毒。通常表现为发热、肌肉疼痛（尤其是背痛）、头痛、寒战、食欲不振、恶心和呕吐。3至4天之后，多数病人会出现好转，症状随之消失。但是，15%的病人在初期症状趋缓后24小时内，病情即进入第二期，即毒性更强的阶段。高热重新出现，一些身体系统受到影响。病人快速出现黄疸，主诉有腹痛并伴有呕吐。口、鼻、眼或胃可能出血。一旦出现此种症状，呕吐物和粪便中就会带血。肾功能恶化。进入毒性期的病人约有50%在10至14天之内死亡，其余病人康复后不会留下严重的器官损伤。蚊虫孳生发生在房屋四周（家居环境）、丛林中（野外），或两种栖息地兼而有之（半家居环境）。有三种类型的传播链：</p><p>森林型（或丛林型）黄热病：在热带雨林中，黄热病发生在被野外蚊虫叮咬而受感染的猴子身上。受感染的猴子再将病毒传给叮咬它的蚊子。受感染的蚊子叮咬进入林区的人，导致偶尔出现黄热病病例。感染大多发生在林区工作（如林中伐木）的青年男子身上。</p><p>中间型黄热病：在非洲潮湿或半潮湿地区，经常发生小规模流行。半家居环境中的蚊子（在野外和房屋四周繁殖）感染猴子和人。人与受感染的蚊子接触机会增多，导致病毒传播。一个地区可有许多单独的村庄同时出现病例。在非洲，这类疫情最为常见。如果在感染传入的地区，有家居环境中的蚊子存在，人群又没有接种过疫苗，在当地就可能出现较为严重的疾病流行。</p><p>城市型黄热病：如果受感染的人把病毒带入人口稠密且未进行免疫的地区，并有伊蚊生存繁殖，就会发生大规模流行。受感染的蚊子在人与人之间传播病毒。</p><h3>基孔肯雅热</h3><p>目前已知基孔肯雅热是由基孔肯雅病毒引起的一种急性传染病。蚊子为传染媒介。该病是一种自然疫源性疾病, 传染源主要是受感染的动物宿主和病人。基孔肯雅病毒的动物宿主有绿猴、狒狒、黑猩猩、牛、马、猪、兔等。主要传播途径是蚊虫吸血传播, 能传播基孔肯雅的蚊虫有埃及伊蚊、非洲曼蚊、非洲伊蚊、棕翅曼蚊等。此外, 本病还可经呼吸道传播。经过3～1 2 天的潜伏期, 感染者即可发病。发热病人常突然起病, 寒颤、发热39℃以上, 伴有头痛、恶心、呕吐、食欲减退、淋巴结肿大。一般发热1 ～7天即可退热, 约3天后再次出现较轻微发热, 持续3～5天恢复正常。80%的患者在发病后2～5 天, 可在躯干、四肢的伸展侧、手掌和足底出现红色斑丘疹或猩红热样皮疹, 有瘙痒感, 数天后可消退。有些患者可有结膜充血和轻度畏光的结膜炎表现, 或并发脑膜炎等。关节疼痛与发热同时, 患者全身的多个关节和脊椎出现十分剧烈的疼痛, 且病情发展迅速, 往往在数分钟或数小时内关节功能丧失, 不能活动。该病恢复期长达几周至数月, 甚至3年以上。恢复期病人可分为四组:( 1 ) 急性期后90%病人关节疼痛及僵硬状态完全恢复;( 2) 远端关节间歇性僵硬和不适, 随运动而加重, 但X光拍片检查正常;( 3) 遗留持续性关节僵硬;( 4) 5.6%的病人关节持续性疼痛和僵硬, 或伴肿胀。尽管绝大多数病人的关节损害最终可以恢复,但剧烈疼痛和恢复缓慢的特点明显影响人的正常生活和工作。</p><h3>寨卡病毒病</h3><p>寨卡病毒病是由寨卡病毒引起的一种急性病毒性疾病，主要通过蚊子叮咬传播，一般症状较轻，2-7天自愈，重症及死亡病例罕见。 人们主要通过蚊子叮咬而感染寨卡病毒。人与人之间传播少见，现在已经发现的传播途径包括：1、可以由怀孕的母亲传播给胎儿，但传播几率尚不清楚；可能会在分娩过程中传播给婴儿；目前尚未发现哺乳传播。2、血液传播：可能存在血液传播途径，。3、性传播：寨卡病毒可以男性向其女性性伴传播，但目前尚未发现女性向男性性伴传播情况。被携带有寨卡病毒的蚊子叮咬后数天内（可能为3-12天），约五分之一的人会出现临床症状，包括发热、皮疹和肌肉、关节疼痛等，也可伴有结膜炎、眼后痛和呕吐等表现，一般症状较轻，通常在2-7天后自愈。 目前尚没有针对寨卡病毒病的疫苗。如果你近期曾在有寨卡病毒病的国家或地区居住或旅行，并出现了发热、皮疹、肌肉关节疼痛，应考虑感染寨卡病毒病的可能。但要最终确诊是否感染，需要通过血液检测进行实验室诊断。</p>",
    "三带喙库蚊": "<p>库蚊的一种，棕褐色小型蚊种。兼食人和动物血，猪、牛是其主要吸血对象。三带喙库蚊常常在黄昏后2小时左右，和黎明前时间在室外袭击人、吸人血。三带喙库蚊是脑炎流行地区的主要媒介。</p><h3>流行性乙型脑炎</h3><p>流行性乙型脑炎的传播为媒介以三带喙库蚊为主。人感染乙脑病毒后潜伏期为5-15天，病人症状以高烧、惊厥、昏迷为主要特征，病程一般可分为三个阶段： 1．初期：起病急，主要表现为全身不适、头痛、发烧、常伴有寒战，体温38℃-39℃。头痛常较剧烈，伴有恶心、呕吐（呈喷射状），此期持续时间一般为1-6天。 2．急性脑炎期：最突出的症状是持续高烧，体温高达39℃-40℃以上，几天后中枢神经感染加重，出现意识障碍，如神志恍惚、昏睡和昏迷、惊厥或抽搐，颈项强直，受影响肢体出现麻痹，有的出现呼吸衰竭而死亡。神经系统检查巴宾斯基征阳性，跟腱反射阳性。 3．恢复期：在此期神经系统症状逐渐缓解，体温和脉搏等逐渐恢复正常。接种乙脑疫苗以提高人群免疫力是预防乙脑的重要措施之一。接种对象是流行区的儿童及从非流行区到流行区的敏感人群。目前有灭活疫苗和活疫苗两种。为了确保疫苗接种效果，接种时间应在流行季节前1-3个月完成。儿童经初次基础免疫后应按规定加强免疫。疫苗在运输和储存过程中均应在4℃保存，以保证其有效性。</p>",
    "中华按蚊": "<p>按蚊的一种。兼食人和动物血，牛、马、驴是其主要吸血对象。稻田通常是其主要孳生场所，也广泛地在沼泽、芦苇塘、湖滨、沟渠、池塘、洼地积水等环境中生长。中华按蚊是中国广大平原地区传播疟疾的重要媒介，也是马来丝虫病的重要媒介之一。</p><h3>疟疾</h3><p>疟疾是由疟原虫寄生于人体、经媒介按蚊传播、引起以周期性发冷、发热、出汗等症状和脾大、贫血等体征为特点的寄生虫病，分为间日疟，恶性疟，三日疟和卵形疟4种。当雌性媒介按蚊叮吸带有疟原虫人的血液时，疟原虫随血液进入蚊体，在适宜温度条件下，疟原虫经过发育、繁殖形成子孢子。进入蚊子唾液腺的子孢子在蚊子再吸血时随唾液进入人体传播疟疾。输入带有疟原虫人的血液、使用被带有疟原虫人的血液污染的注射器等也可传播疟疾。疟原虫也可经胎盘传给胎儿，但较少见。按蚊的种类很多，但在自然情况下仅有少数种类能传播疟疾。在我国已知的60余种按蚊中，中华按蚊、嗜人按蚊、微小按蚊和大劣按蚊被公认为我国疟疾的主要传播媒介。疟疾临床症状通常有以下四期：1） 前驱期  头痛、全身酸痛、乏力、畏寒。2）发冷期  手脚发冷，继而寒战、发抖、面色苍白、口唇指甲发绀。体温迅速上升、此期可持续10多分钟至2小时。3）发热期  寒战后全身发热、头痛、口渴，体温可升至39oC或以上，有些病人可出现抽搐、此期可持续2－3小时。4）出汗期  高热后大汗淋漓，体温迅速下降，此期可持续1小时以上。</p>"
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
        // console.log(t);
        getProvince(lat, lon)
            .then(function (province) {
                console.log(province);
                var querys = new AV.Query('VaidProvinces');
                querys.equalTo('provinces_name', province);
                return querys.find().then(function (results) {
                    var provinces_item = results[0];
                    if (provinces_item) {
                        var minCount = t.getHours() * 60 + t.getMinutes();
                        if (minCount > (provinces_item.get('start').start_hour * 60 + provinces_item.get('start').start_min) &&
                            minCount < (provinces_item.get('end').end_hour * 60 + provinces_item.get('end').end_min)) {
                            console.log('DAY diseaseRate:' + provinces_item.get("diseaseRate"));
                            return Promise.resolve({
                                mozRiskRate: provinces_item.get("dayRiskRate"),
                                diseaseRate: provinces_item.get("diseaseRate")
                            });
                        } else {
                            console.log('NIGHT diseaseRate:' + provinces_item.get("diseaseRate"));
                            return Promise.resolve({
                                mozRiskRate: provinces_item.get("nightRiskRate"),
                                diseaseRate: provinces_item.get("diseaseRate")
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
                console.log("rates.diseaseRate:" + rates.diseaseRate);
                console.log("rates.mozRiskRate:" + rates.mozRiskRate);
                var dRate = (rates.diseaseRate * 100000) * 40;
                dRate = (dRate > 40) ? 40 : dRate;
                console.log("dRate:" + dRate);
                if (family_disease.length > 0) {
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
                fulfill({
                    rate: result,
                    lat: lat,
                    lon: lon
                });
            }, function (err) {
                reject(err);
            })
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

AV.Cloud.define('insect_statistic', function (request, response) {
    var lat = request.params.lat,
        lon = request.params.lon,
        time = request.params.time;
    console.log('insect_statistic,' + JSON.stringify(request.params));
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
                                desc: INSECT_INFO[i],
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

var AVAILABLE_PROVINCES = ["广东省", "云南省", "广西壮族自治区", "海南省", "福建省", "浙江省", "上海市", "河北省", "北京市"];

function getLastPicture(user_id) {
    if (_.isString(user_id) && user_id.length > 0) {
        var query = new AV.Query('CameraPosition');
        query.equalTo('user', AV.Object.createWithoutData('_User', user_id));
        query.descending('createdAt');
        return query.first();
    } else {
        return Promise.resolve(undefined);
    }
}

function getOptionsResult(take_picture, diagnose, in_service) {
    return {
        take_picture: {
            available: take_picture
        },
        diagnose: {
            available: diagnose
        },
        in_service: in_service,
        available_locations: {
            provinces: _.map(AVAILABLE_PROVINCES, function (p) {
                return {name: p}
            })
        }
    }
}

AV.Cloud.define('options', function (request, response) {
    console.log('options,' + JSON.stringify(request.params));
    var lat = request.params.lat,
        lon = request.params.lon,
        user_id = request.params.user_id;

    if (!_.isFinite(lat) || !_.isFinite(lon)) {
        // Invalid latitude or longitude
        response.success(getOptionsResult(false, false, false));
    } else {
        // Must be "Logged in", has some sort of latitude and longitude
        Promise.all([getProvince(lat, lon), getLastPicture(user_id)])
            .then(function (values) {
                var province = values[0],
                    last_picture = values[1],
                    in_service = _.contains(AVAILABLE_PROVINCES, province);
                response.success(getOptionsResult(
                    in_service,
                    _.isObject(last_picture),
                    in_service
                ));
            }, function (err) {
                console.log(err);
                response.success(getOptionsResult(false, false, false));
            })
    }
})

AV.Cloud.define('is_available', function (request, response) {
    console.log('is_available,' + JSON.stringify(request.params));
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


function getLastPicture(user_id) {
    var query = new AV.Query('CameraPosition');
    query.equalTo('user', AV.Object.createWithoutData('_User', user_id));
    query.descending('createdAt');
    return query.first();
}

var Scoring = AV.Object.extend('Scoring');
AV.Cloud.define('get_grade', function (request, response) {
    console.log('get_grade,' + JSON.stringify(request.params));
    var user_id = request.params.user_id;
    var symptoms = request.params.symptoms || [];
    var family_disease = request.params.family_disease || [];
    var lastpicture;
    if (!_.isString(user_id) || user_id.length == 0) {
        response.error("invalid user_id");
        return;
    }
    getLastPicture(user_id)
        .then(function (lp) {
            lastpicture = lp;
            if (!_.isObject(lp)) {
                throw new Error("invalid user_id");
            }
            return diagnose(
                lastpicture.get('imgCoordinate').latitude,
                lastpicture.get('imgCoordinate').longitude,
                lastpicture.createdAt.toISOString(),
                symptoms,
                family_disease,
                lastpicture.createdAt);
        })
        .then(function (result) {
            var rate = result.rate;
            var suggestion = getSuggestion(rate, symptoms, family_disease, lastpicture.createdAt);
            var result = {
                risk_rate: rate,
                lastpicture: lastpicture,
                lastpicture_when: lastpicture.createdAt,
                suggestion: suggestion,
                user: AV.Object.createWithoutData('_User', user_id),
                lastpicture_location: new AV.GeoPoint(lastpicture.get('imgCoordinate').latitude, lastpicture.get('imgCoordinate').longitude)
            };
            return new Scoring(result).save();
        })
        .then(function (scoring) {
            console.log(scoring);
            response.success(scoring);
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
