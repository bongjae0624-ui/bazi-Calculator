/**
 * BaziMaster Interaction & Shinsal Engine
 * 기능: 형/파/해, 원진&귀문(통합), 모든 귀인, 12신살(중복제거)
 */
window.BaziMaster = window.BaziMaster || {}; 

BaziMaster.getInteractions = function(allZhis, currentZhi) {
    let res = [];
    const zhisStr = allZhis.join('');

    // 1. 형(刑) - 삼형, 자형, 상형
    const samHyung = ['寅巳申', '丑戌未'];
    samHyung.forEach(sh => {
        let count = 0;
        for(let char of sh) { if(zhisStr.includes(char)) count++; }
        if(count >= 2 && sh.includes(currentZhi)) res.push({type:'hyung', name: count === 3 ? '삼형살' : '형살(세력)'});
    });
    if(['子卯'].some(s => s.includes(currentZhi) && zhisStr.includes(s[0]) && zhisStr.includes(s[1]))) res.push({type:'hyung', name:'상형(자묘)'});
    if(['辰辰','午午','酉酉','亥亥'].some(s => s.includes(currentZhi) && zhisStr.split(currentZhi).length > 2)) res.push({type:'hyung', name:'자형'});

    // 2. 파(破) & 해(害)
    const pa = {'子':'酉','丑':'辰','寅':'亥','卯':'午','巳':'申','戌':'未'};
    const hae = {'子':'未','丑':'午','寅':'巳','卯':'辰','申':'亥','酉':'戌'};
    if(zhisStr.includes(pa[currentZhi])) res.push({type:'pa', name:'파살'});
    if(zhisStr.includes(hae[currentZhi])) res.push({type:'hae', name:'해살'});

    // 3. 원진 & 귀문관살 (통합 처리)
    const wonjin = {'子':'未','丑':'午','寅':'酉','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'子','申':'卯','酉':'寅','戌':'巳','亥':'辰'};
    const gwimun = {'子':'酉','丑':'午','寅':'未','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'寅','申':'卯','酉':'子','戌':'巳','亥':'辰'};
    
    let psychic = [];
    if(zhisStr.includes(wonjin[currentZhi])) psychic.push("원진");
    if(zhisStr.includes(gwimun[currentZhi])) psychic.push("귀문");
    if(psychic.length > 0) res.push({type:'psychic', name: psychic.join('&') + "관살"});

    return res;
};

BaziMaster.getNobility = function(meGan, monthZhi, targetZhi, targetGan) {
    let n = [];
    // 천을귀인
    if({'甲':'未丑','乙':'申子','丙':'亥酉','丁':'亥酉','戊':'未丑','己':'申子','庚':'未丑','辛':'午寅','壬':'卯巳','癸':'卯巳'}[meGan].includes(targetZhi)) n.push("천을귀인");
    // 문창귀인
    if({'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'}[meGan] === targetZhi) n.push("문창귀인");
    // 암록
    if({'甲':'亥','乙':'戌','丙':'申','丁':'未','戊':'申','己':'未','庚':'巳','辛':'辰','壬':'寅','癸':'丑'}[meGan] === targetZhi) n.push("암록");
    // 태극귀인
    if({'甲乙':'子午','丙丁':'卯酉','戊己':'辰戌丑未','庚辛':'寅亥','壬癸':'巳申'}[Object.keys({'甲乙':'','丙丁':'','戊己':'','庚辛':'','壬癸':''}).find(k=>k.includes(meGan))].includes(targetZhi)) n.push("태극귀인");
    // 천주귀인
    if({'甲':'巳','乙':'午','丙':'巳','丁':'午','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'}[meGan] === targetZhi) n.push("천주귀인");

    return n;
};

BaziMaster.getIntegrated12Sal = function(yearZhi, targetZhi) {
    const order = ["겁살","재살","천살","지살","년살","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
    const groups = {'亥卯未':'亥','寅午戌':'寅','巳酉丑':'巳','申子辰':'申'};
    const groupKey = Object.keys(groups).find(k => k.includes(yearZhi));
    const diff = (this.ZHIS.indexOf(targetZhi) - this.ZHIS.indexOf(groups[groupKey]) + 12) % 12;
    
    let res = order[diff];
    // 진도화 체크 (년살일 때만)
    if(res === "년살") {
        const isJin = (yearZhi==='申'||yearZhi==='子'||yearZhi==='辰') && targetZhi==='酉';
        if(isJin) res = "진도화";
    }
    return res; // 화개살은 자동 포함 및 중복 없음
};

BaziMaster.getStrongEnergy = function(pillar, meGan) {
    let s = [];
    const full = pillar; // '甲子' 형식
    if(["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"].includes(full)) s.push("백호대살");
    if(["戊戌", "庚戌", "庚辰", "壬辰"].includes(full)) s.push("괴강살");
    const hong = {'甲':'午','乙':'申','丙':'寅','丁':'未','戊':'辰','己':'辰','庚':'戌','辛':'酉','壬':'申','癸':'申'};
    if(hong[meGan] === pillar[1]) s.push("홍염살");
    return s;
};