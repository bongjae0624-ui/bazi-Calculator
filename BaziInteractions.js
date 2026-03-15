/**
 * BaziMaster Interaction & Shinsal Engine
 * 보정 내용: 12신살 삼합 기준 정립, 백호/괴강/귀인 데이터 보강
 */
window.BaziMaster = window.BaziMaster || {};

// 1. 지지 관계 (형, 파, 해, 원진, 귀문)
BaziMaster.getInteractions = function(allZhis, currentZhi) {
    let res = [];
    const zhisStr = allZhis.join('');

    // 형(刑)
    const samHyung = ['寅巳申', '丑戌未'];
    samHyung.forEach(sh => {
        let count = 0;
        for(let char of sh) { if(zhisStr.includes(char)) count++; }
        if(count >= 2 && sh.includes(currentZhi)) res.push({type:'hyung', name: count === 3 ? '삼형살' : '형살'});
    });
    if(['子卯'].some(s => s.includes(currentZhi) && zhisStr.includes(s[0]) && zhisStr.includes(s[1]))) res.push({type:'hyung', name:'상형'});
    if(['辰辰','午午','酉酉','亥亥'].some(s => s.includes(currentZhi) && zhisStr.split(currentZhi).length > 2)) res.push({type:'hyung', name:'자형'});
    
    // 원진 & 귀문
    const wonjin = {'子':'未','丑':'午','寅':'酉','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'子','申':'卯','酉':'寅','戌':'巳','亥':'辰'};
    const gwimun = {'子':'酉','丑':'午','寅':'未','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'寅','申':'卯','酉':'子','戌':'巳','亥':'辰'};
    if(wonjin[currentZhi] && zhisStr.includes(wonjin[currentZhi])) res.push({type:'psychic', name:'원진살'});
    if(gwimun[currentZhi] && zhisStr.includes(gwimun[currentZhi])) res.push({type:'psychic', name:'귀문관살'});

    return res;
};

// 2. 귀인 (천을, 문창, 암록 등)
BaziMaster.getNobility = function(meGan, monthZhi, targetZhi, targetGan) {
    let n = [];
    // 천을귀인 (공통)
    const nobMap = {'甲':'未丑','乙':'申子','丙':'亥酉','丁':'亥酉','戊':'未丑','己':'申子','庚':'未丑','辛':'午寅','壬':'卯巳','癸':'卯巳'};
    if(nobMap[meGan] && nobMap[meGan].includes(targetZhi)) n.push("천을귀인");
    
    // 문창귀인
    const wenMap = {'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
    if(wenMap[meGan] === targetZhi) n.push("문창귀인");

    // 암록 (일간 기준)
    const amMap = {'甲':'亥','乙':'戌','丙':'申','丁':'未','戊':'申','己':'未','庚':'巳','辛':'辰','壬':'寅','癸':'丑'};
    if(amMap[meGan] === targetZhi) n.push("암록");

    return n;
};

// 3. 12신살 (삼합 기준 보정)
BaziMaster.getIntegrated12Sal = function(yearZhi, targetZhi) {
    const order = ["겁살","재살","천살","지살","년살","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
    
    // 삼합의 기준점(장성살) 설정
    const groups = {
        '亥': '亥', '卯': '亥', '未': '亥', // 해묘미 -> 목국 (기준: 해)
        '寅': '寅', '午': '寅', '戌': '寅', // 인오술 -> 화국 (기준: 인)
        '巳': '巳', '酉': '巳', '丑': '巳', // 사유축 -> 금국 (기준: 사)
        '申': '申', '子': '申', '辰': '申'  // 신자진 -> 수국 (기준: 신)
    };
    
    const startZhi = groups[yearZhi];
    if(!startZhi) return "";
    
    const zhis = BaziData.ZHIS; // "子丑寅卯..."
    const targetIdx = zhis.indexOf(targetZhi);
    const startIdx = zhis.indexOf(startZhi);
    
    // 지살(삼합의 첫글자)부터 시작하도록 인덱스 계산
    // 지살은 order의 3번째(index 3)이므로, 차이값에 +3을 해줍니다.
    const diff = (targetIdx - startIdx + 12) % 12;
    const finalIdx = (diff + 3) % 12;
    
    return order[finalIdx];
};

// 4. 특수살 (백호, 괴강)
BaziMaster.getStrongEnergy = function(pillar, meGan) {
    let s = [];
    // 백호대살 (정확한 7가지)
    const baekho = ["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"];
    if(baekho.includes(pillar)) s.push("백호살");
    
    // 괴강살 (정확한 4가지)
    const goegang = ["戊戌", "庚戌", "庚辰", "壬辰"];
    if(goegang.includes(pillar)) s.push("괴강살");
    
    return s;
};