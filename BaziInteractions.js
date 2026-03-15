/**
 * BaziMaster Interaction & Shinsal Engine (Universal Version)
 * 모든 일주와 년주 조합에 대응하는 통합 엔진
 */
window.BaziMaster = window.BaziMaster || {};

// 1. 지지 관계 (형/파/해/원진/귀문)
BaziMaster.getInteractions = function(allZhis, currentZhi) {
    let res = [];
    const zhisStr = allZhis.join('');
    
    // 원진 & 귀문관살 (표준 매핑)
    const wonjin = {'子':'未','丑':'午','寅':'酉','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'子','申':'卯','酉':'寅','戌':'巳','亥':'辰'};
    const gwimun = {'子':'酉','丑':'午','寅':'未','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'寅','申':'卯','酉':'子','戌':'巳','亥':'辰'};
    
    if(wonjin[currentZhi] && zhisStr.includes(wonjin[currentZhi])) res.push({type:'psychic', name:'원진살'});
    if(gwimun[currentZhi] && zhisStr.includes(gwimun[currentZhi])) res.push({type:'psychic', name:'귀문관살'});
    
    // 형살 (삼형, 자형, 상형)
    if(['辰辰','午午','酉酉','亥亥'].some(s => s.includes(currentZhi) && zhisStr.split(currentZhi).length > 2)) res.push({type:'hyung', name:'자형'});
    
    return res;
};

// 2. 귀인 및 특수살 (60갑자 전체 대응 데이터)
BaziMaster.getNobility = function(meGan, targetZhi, targetGan, pillar) {
    let n = [];
    const p = pillar; 

    // 천을귀인 (표준)
    const nobMap = {'甲':'未丑','乙':'申子','丙':'亥酉','丁':'亥酉','戊':'未丑','己':'申子','庚':'未丑','辛':'午寅','壬':'卯巳','癸':'卯巳'};
    if(nobMap[meGan] && nobMap[meGan].includes(targetZhi)) n.push("천을귀인");

    // 암록 (표준: 건록과 육합하는 글자)
    const amMap = {'甲':'亥','乙':'戌','丙':'申','丁':'未','戊':'申','己':'未','庚':'巳','辛':'辰','壬':'寅','癸':'丑'};
    if(amMap[meGan] === targetZhi) n.push("암록");

    // 학당귀인 (표준: 일간의 장생지)
    const hakdang = {'甲':'亥','乙':'午','丙':'寅','丁':'酉','戊':'寅','己':'酉','庚':'巳','辛':'子','壬':'申','癸':'卯'};
    if(hakdang[meGan] === targetZhi) n.push("학당귀인");

    // 문곡귀인
    const mungok = {'甲':'巳','乙':'亥','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
    if(mungok[meGan] === targetZhi) n.push("문곡귀인");

    // 현침살 (甲, 申, 卯, 午, 辛 글자 포함)
    if(/[甲申卯午辛]/.test(p)) n.push("현침살");

    // 홍염살 (표준 매핑)
    const hongyum = {'甲':'午','乙':'午','丙':'寅','丁':'未','戊':'辰','己':'辰','庚':'戌','辛':'酉','壬':'申','癸':'子'};
    if(hongyum[meGan] === targetZhi) n.push("홍염살");

    // 낙정관살
    const nakjeong = {'甲':'巳','乙':'子','丙':'亥','丁':'戌','戊':'申','己':'酉','庚':'午','辛':'未','壬':'卯','癸':'辰'};
    if(nakjeong[meGan] === targetZhi) n.push("낙정관살");

    return n;
};

// 3. 12신살 (년지 기준 + 일지 기준 이중 계산 로직)
BaziMaster.getIntegrated12Sal = function(yearZhi, dayZhi, targetZhi) {
    const order = ["겁살","재살","천살","지살","년살","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
    const groups = {
        '亥':'亥','卯':'亥','未':'亥', // 목국
        '寅':'寅','午':'寅','戌':'寅', // 화국
        '巳':'巳','酉':'巳','丑':'巳', // 금국
        '申':'申','子':'申','辰':'申'  // 수국
    };
    
    const calculate = (base) => {
        const startZhi = groups[base];
        const zhis = "子丑寅卯辰巳午未申酉戌亥";
        const diff = (zhis.indexOf(targetZhi) - zhis.indexOf(startZhi) + 12) % 12;
        return order[(diff + 3) % 12]; // 지살(index 3)부터 시작
    };

    const s1 = calculate(yearZhi); // 년지 기준
    const s2 = calculate(dayZhi);  // 일지 기준
    
    return s1 === s2 ? s1 : `${s1},${s2}`;
};

// 4. 강한 살 (백호/괴강)
BaziMaster.getStrongEnergy = function(pillar) {
    let s = [];
    if(["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"].includes(pillar)) s.push("백호살");
    if(["戊戌", "庚戌", "庚辰", "壬辰"].includes(pillar)) s.push("괴강살");
    return s;
};