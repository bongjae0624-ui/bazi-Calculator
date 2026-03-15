/**
 * BaziMaster Interaction & Shinsal Engine
 */
window.BaziMaster = window.BaziMaster || {};

BaziMaster.getInteractions = function(allZhis, currentZhi) {
    let res = [];
    const zhisStr = allZhis.join('');

    const samHyung = ['寅巳申', '丑戌未'];
    samHyung.forEach(sh => {
        let count = 0;
        for(let char of sh) { if(zhisStr.includes(char)) count++; }
        if(count >= 2 && sh.includes(currentZhi)) res.push({type:'hyung', name: count === 3 ? '삼형살' : '형살(세력)'});
    });
    if(['子卯'].some(s => s.includes(currentZhi) && zhisStr.includes(s[0]) && zhisStr.includes(s[1]))) res.push({type:'hyung', name:'상형(자묘)'});
    if(['辰辰','午午','酉酉','亥亥'].some(s => s.includes(currentZhi) && zhisStr.split(currentZhi).length > 2)) res.push({type:'hyung', name:'자형'});
    
    const pa = {'子':'酉','丑':'辰','寅':'亥','卯':'午','巳':'申','戌':'未','酉':'子','辰':'丑','亥':'寅','午':'卯','申':'巳','未':'戌'};
    const hae = {'子':'未','丑':'午','寅':'巳','卯':'辰','辰':'卯','巳':'寅','午':'丑','未':'子','申':'亥','酉':'戌','戌':'酉','亥':'申'};
    if(zhisStr.includes(pa[currentZhi])) res.push({type:'pa', name:'파살'});
    if(zhisStr.includes(hae[currentZhi])) res.push({type:'hae', name:'해살'});

    const wonjin = {'子':'未','丑':'午','寅':'酉','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'子','申':'卯','酉':'寅','戌':'巳','亥':'辰'};
    const gwimun = {'子':'酉','丑':'午','寅':'未','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'寅','申':'卯','酉':'子','戌':'巳','亥':'辰'};
    if(zhisStr.includes(wonjin[currentZhi])) res.push({type:'psychic', name:'원진살'});
    if(zhisStr.includes(gwimun[currentZhi])) res.push({type:'psychic', name:'귀문관살'});

    return res;
};

BaziMaster.getNobility = function(meGan, monthZhi, targetZhi, targetGan) {
    let n = [];
    const nobMap = {'甲':'未丑','乙':'申子','丙':'亥酉','丁':'亥酉','戊':'未丑','己':'申子','庚':'未丑','辛':'午寅','壬':'卯巳','癸':'卯巳'};
    if(nobMap[meGan] && nobMap[meGan].includes(targetZhi)) n.push("천을귀인");
    const wenMap = {'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
    if(wenMap[meGan] === targetZhi) n.push("문창귀인");
    return n;
};

BaziMaster.getIntegrated12Sal = function(yearZhi, targetZhi) {
    const order = ["겁살","재살","천살","지살","년살","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
    const groups = {'亥卯未':'亥','寅午戌':'寅','巳酉丑':'巳','申子辰':'申'};
    const groupKey = Object.keys(groups).find(k => k.includes(yearZhi));
    if(!groupKey) return "";
    
    // BaziData에서 지지 목록을 가져와 명확하게 참조
    const zhis = BaziData.ZHIS;
    const targetIdx = zhis.indexOf(targetZhi);
    const startIdx = zhis.indexOf(groups[groupKey]);
    
    if(targetIdx === -1 || startIdx === -1) return "";

    const diff = (targetIdx - startIdx + 12) % 12;
    return order[diff];
};

BaziMaster.getStrongEnergy = function(pillar, meGan) {
    let s = [];
    if(["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"].includes(pillar)) s.push("백호살");
    if(["戊戌", "庚戌", "庚辰", "壬辰"].includes(pillar)) s.push("괴강살");
    return s;
};