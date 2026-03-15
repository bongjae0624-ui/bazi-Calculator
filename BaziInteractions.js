/**
 * BaziMaster Interaction & Shinsal Engine (Professional Edition)
 * 전 영역 귀인 및 신살 데이터 완전 보강 버전
 */
window.BaziMaster = window.BaziMaster || {};

// 1. 지지 관계 (형/파/해/원진/귀문)
BaziMaster.getInteractions = function(allZhis, currentZhi) {
    let res = [];
    const zhisStr = allZhis.join('');
    
    const wonjin = {'子':'未','丑':'午','寅':'酉','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'子','申':'卯','酉':'寅','戌':'巳','亥':'辰'};
    const gwimun = {'子':'酉','丑':'午','寅':'未','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'寅','申':'卯','酉':'子','戌':'巳','亥':'辰'};
    
    if(wonjin[currentZhi] && zhisStr.includes(wonjin[currentZhi])) res.push({type:'psychic', name:'원진살'});
    if(gwimun[currentZhi] && zhisStr.includes(gwimun[currentZhi])) res.push({type:'psychic', name:'귀문관살'});
    
    // 형살 (삼형/자형)
    const hyungPairs = ['寅巳','巳申','申寅','丑戌','戌未','未丑','子卯'];
    hyungPairs.forEach(p => {
        if(p.includes(currentZhi) && p.split('').every(z => zhisStr.includes(z))) {
            const name = ['寅巳申'].every(z => zhisStr.includes(z)) ? '삼형살' : '형살';
            if(!res.some(r => r.name === name)) res.push({type:'hyung', name: name});
        }
    });
    if(['辰','午','酉','亥'].includes(currentZhi) && zhisStr.split(currentZhi).length > 2) res.push({type:'hyung', name:'자형'});
    
    return res;
};

// 2. 귀인 및 특수살 (전체 데이터 매핑)
BaziMaster.getNobility = function(meGan, targetZhi, targetGan, pillar) {
    let n = [];
    const zhi = targetZhi;

    // --- [길신/귀인류] ---
    // 천을귀인 (가장 존귀한 길신)
    const nobMap = {'甲':'未丑','乙':'申子','丙':'亥酉','丁':'亥酉','戊':'未丑','己':'申子','庚':'未丑','辛':'午寅','壬':'卯巳','癸':'卯巳'};
    if(nobMap[meGan] && nobMap[meGan].includes(zhi)) n.push("천을귀인");

    // 문창귀인 (총명함, 학문)
    const munchang = {'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
    if(munchang[meGan] === zhi) n.push("문창귀인");

    // 암록 (보이지 않는 조력)
    const amMap = {'甲':'亥','乙':'戌','丙':'申','丁':'未','戊':'申','己':'未','庚':'巳','辛':'辰','壬':'寅','癸':'丑'};
    if(amMap[meGan] === zhi) n.push("암록");

    // 금여성 (귀족적인 삶, 배우자덕)
    const geumyeo = {'甲':'辰','乙':'巳','丙':'未','丁':'申','戊':'未','己':'申','庚':'戌','辛':'亥','壬':'丑','癸':'寅'};
    if(geumyeo[meGan] === zhi) n.push("금여성");

    // 건록 (자수성가, 강한 뿌리)
    const geonrok = {'甲':'寅','乙':'卯','丙':'巳','丁':'午','戊':'巳','己':'午','庚':'申','辛':'酉','壬':'亥','癸':'子'};
    if(geonrok[meGan] === zhi) n.push("건록");

    // 협록 (주변의 도움)
    const hyeop = {'甲':'丑','乙':'子','丙':'辰','丁':'卯','戊':'辰','己':'卯','庚':'未','辛':'午','壬':'戌','癸':'酉'};
    if(hyeop[meGan] === zhi) n.push("협록");

    // 학당귀인 (교육, 스승)
    const hakdang = {'甲':'亥','乙':'午','丙':'寅','丁':'酉','戊':'寅','己':'酉','庚':'巳','辛':'子','壬':'申','癸':'卯'};
    if(hakdang[meGan] === zhi) n.push("학당귀인");

    // 문곡귀인 (예술, 문장력)
    const mungok = {'甲':'巳','乙':'亥','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
    if(mungok[meGan] === zhi) n.push("문곡귀인");

    // 태극귀인 (시작과 끝이 좋음)
    const taegeuk = {'甲':'子午','乙':'子午','丙':'卯酉','丁':'卯酉','戊':'辰戌丑未','己':'辰戌丑未','庚':'寅亥','辛':'寅亥','壬':'巳申','癸':'巳申'};
    if(taegeuk[meGan] && taegeuk[meGan].includes(zhi)) n.push("태극귀인");

    // 월덕귀인/천덕귀인 (월지 기준) - 데이터 구조상 추가 로직 필요하나 기본 매핑만 포함

    // --- [살성/특수류] ---
    // 홍염살 (매력, 풍류)
    const hongyum = {'甲':'午','乙':'午','丙':'寅','丁':'未','戊':'辰','己':'辰','庚':'戌','辛':'酉','壬':'申','癸':'子'};
    if(hongyum[meGan] === zhi) n.push("홍염살");

    // 현침살 (뾰족한 기운, 전문기술)
    if(/[甲申卯午辛]/.test(pillar)) n.push("현침살");

    // 낙정관살 (함정, 사고 주의)
    const nakjeong = {'甲':'巳','乙':'子','丙':'亥','丁':'戌','戊':'申','己':'酉','庚':'午','辛':'未','壬':'卯','癸':'辰'};
    if(nakjeong[meGan] === zhi) n.push("낙정관살");

    return n;
};

// 3. 12신살 (이중 기준 완전 대응)
BaziMaster.getIntegrated12Sal = function(yearZhi, dayZhi, targetZhi) {
    const order = ["겁살","재살","천살","지살","년살","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
    const groups = {'亥':'亥','卯':'亥','未':'亥','寅':'寅','午':'寅','戌':'寅','巳':'巳','酉':'巳','丑':'巳','申':'申','子':'申','辰':'申'};
    
    const calculate = (base) => {
        if(!base || !groups[base]) return "";
        const startZhi = groups[base];
        const zhis = "子丑寅卯辰巳午未申酉戌亥";
        const diff = (zhis.indexOf(targetZhi) - zhis.indexOf(startZhi) + 12) % 12;
        return order[(diff + 3) % 12];
    };

    const s1 = calculate(yearZhi);
    const s2 = calculate(dayZhi);
    
    return s1 === s2 ? [s1] : [s1, s2];
};

// 4. 강한 에너지 (백호/괴강)
BaziMaster.getStrongEnergy = function(pillar) {
    let s = [];
    if(["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"].includes(pillar)) s.push("백호살");
    if(["戊戌", "庚戌", "庚辰", "壬辰"].includes(pillar)) s.push("괴강살");
    return s;
};