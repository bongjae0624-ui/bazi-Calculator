/**
 * Bazi Master Ultimate Logic Engine
 * 모든 권한: 사용자 (유튜브 라이브 및 웹 서비스 최적화)
 */

const BaziMaster = {
    // --- [기초 데이터 사전] ---
    GANS: "甲乙丙丁戊己庚辛壬癸",
    ZHIS: "子丑寅卯辰巳午未申酉戌亥",
    
    // 십이운성 테이블
    TWELVE_MAP: {
        '甲':{'亥':'장생','戌':'양','酉':'태','申':'절','未':'묘','午':'사','巳':'병','辰':'쇠','卯':'제왕','寅':'건록','丑':'관대','子':'목욕'},
        '乙':{'午':'장생','巳':'양','辰':'태','卯':'절','寅':'묘','丑':'사','子':'병','亥':'쇠','戌':'제왕','酉':'건록','申':'관대','未':'목욕'},
        '丙':{'寅':'장생','丑':'양','子':'태','亥':'절','戌':'묘','酉':'사','申':'병','未':'쇠','午':'제왕','巳':'건록','辰':'관대','卯':'목욕'},
        '丁':{'酉':'장생','申':'양','未':'태','午':'절','巳':'묘','辰':'사','卯':'병','寅':'쇠','丑':'제왕','子':'건록','亥':'관대','戌':'목욕'},
        '戊':{'寅':'장생','丑':'양','子':'태','亥':'절','戌':'묘','酉':'사','申':'병','未':'쇠','午':'제왕','巳':'건록','辰':'관대','卯':'목욕'},
        '己':{'酉':'장생','申':'양','未':'태','午':'절','巳':'묘','辰':'사','卯':'병','寅':'쇠','丑':'제왕','子':'건록','亥':'관대','戌':'목욕'},
        '庚':{'巳':'장생','辰':'양','卯':'태','寅':'절','丑':'묘','子':'사','亥':'병','戌':'쇠','酉':'제왕','申':'건록','未':'관대','午':'목욕'},
        '辛':{'子':'장생','亥':'양','戌':'태','酉':'절','申':'묘','未':'사','午':'병','巳':'쇠','辰':'제왕','卯':'건록','寅':'관대','丑':'목욕'},
        '壬':{'申':'장생','未':'양','午':'태','巳':'절','辰':'묘','卯':'사','寅':'병','丑':'쇠','子':'제왕','亥':'건록','戌':'관대','酉':'목욕'},
        '癸':{'卯':'장생','寅':'양','丑':'태','子':'절','亥':'묘','戌':'사','酉':'병','申':'쇠','미':'제왕','午':'건록','巳':'관대','辰':'목욕'}
    },

    // 납음오행 테이블
    NABUM_MAP: {
        "甲子":"해중금","乙丑":"해중금","丙寅":"로중화","丁卯":"로중화","戊辰":"대림목","己巳":"대림목","庚午":"노방토","辛未":"노방토","壬申":"검봉금","癸酉":"검봉금","甲戌":"산두화","乙亥":"산두화","丙子":"간하수","丁丑":"간하수","戊寅":"성두토","己卯":"성두토","庚辰":"백학금","辛巳":"백학금","壬午":"양류목","癸未":"양류목","甲申":"천중수","乙酉":"천중수","丙戌":"옥상토","丁亥":"옥상토","戊자":"벽력화","己丑":"벽력화","庚寅":"송백목","辛卯":"송백목","壬辰":"장류수","癸巳":"장류수","甲午":"사중금","乙未":"사중금","丙申":"산하화","丁酉":"산하화","戊戌":"평지목","己亥":"평지목","庚子":"벽상토","辛丑":"벽상토","壬寅":"금박금","癸卯":"금박금","甲辰":"복등화","乙巳":"복등화","丙午":"천하수","丁未":"천하수","戊申":"대역토","己酉":"대역토","庚戌":"차천금","辛亥":"차천금","壬子":"상제목","癸丑":"상제목","甲寅":"대계수","乙卯":"대계수","丙辰":"사중토","丁巳":"사중토","戊午":"천상화","己未":"천상화","庚申":"석류목","辛酉":"석류목","壬戌":"대해수","癸亥":"대해수"
    },

    // 1. 기초 십신(육친) 계산
    getShinsin: function(meGan, targetGan) {
        const mI = this.GANS.indexOf(meGan), tI = this.GANS.indexOf(targetGan);
        const diff = (Math.floor(tI/2) - Math.floor(mI/2) + 5) % 5;
        const names = [["비견","겁재"],["식신","상관"],["편재","정재"],["편관","정관"],["편인","정인"]];
        return names[diff][(mI%2 === tI%2) ? 0 : 1];
    },

    // 2. 공망 계산
    getGongmang: function(dayPillar) {
        const gIdx = this.GANS.indexOf(dayPillar[0]), zIdx = this.ZHIS.indexOf(dayPillar[1]);
        const lastZ = (zIdx + (9 - gIdx)) % 12;
        return [this.ZHIS[(lastZ+1)%12], this.ZHIS[(lastZ+2)%12]];
    },

    // 3. 형충파해 및 합(방합, 삼합, 암합) 정밀 분석
    getInteractions: function(allPillars, currentZhi) {
        let res = [];
        const allZhis = allPillars.filter(p => p !== "??").map(p => p[1]);
        
        // 충 (Clash)
        const clash = {'子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳'};
        if(allZhis.includes(clash[currentZhi])) res.push({type:'clash', name:`충(${clash[currentZhi]})`});

        // 삼합 (Purpose)
        const sam = {'亥卯未':'목','寅午戌':'화','巳酉丑':'금','申子辰':'수'};
        for(let key in sam) {
            if(key.includes(currentZhi)) {
                const cnt = [...key].filter(z => allZhis.includes(z)).length;
                if(cnt >= 2) res.push({type:'union', name:`삼합(${sam[key]})${cnt==2?'(반)':''}`});
            }
        }

        // 방합 (Direction)
        const bang = {'寅卯辰':'목','巳午未':'화','申酉戌':'금','亥子丑':'수'};
        for(let key in bang) {
            if(key.includes(currentZhi)) {
                const cnt = [...key].filter(z => allZhis.includes(z)).length;
                if(cnt >= 2) res.push({type:'union', name:`방합(${bang[key]})${cnt==2?'(반)':''}`});
            }
        }

        // 암합 (Hidden Union)
        const am = {'子':'戌','寅':'未','卯':'申','午':'亥','丑':'辰','戌':'子','未':'寅','申':'卯','亥':'午','辰':'丑'};
        if(allZhis.includes(am[currentZhi])) res.push({type:'union', name:`암합(${currentZhi}+${am[currentZhi]})`});

        // 원진 (Resentment)
        const won = {'子':'未','丑':'午','寅':'酉','卯':'申','辰':'亥','巳':'戌','午':'丑','未':'子','申':'卯','酉':'寅','戌':'巳','亥':'辰'};
        if(allZhis.includes(won[currentZhi])) res.push({type:'clash', name:`원진(${won[currentZhi]})`});

        return res;
    },

    // 4. 모든 신살 및 귀인 분석
    getShinsal: function(meGan, meZhi, yearZhi, monthZhi, pillar, idPillar) {
        let s = [];
        const gan = pillar[0], zhi = pillar[1];

        // 천을귀인
        const noble = {'甲':'未丑','乙':'申子','丙':'亥酉','丁':'亥酉','戊':'未丑','己':'申子','庚':'未丑','辛':'寅午','壬':'卯巳','癸':'卯巳'};
        if(noble[meGan].includes(zhi)) s.push({type:'noble', name:'천을귀인'});

        // 월덕/천덕귀인 (월지 기준)
        const wolDuk = {'寅':'丙','卯':'甲','辰':'壬','巳':'庚','午':'丙','未':'甲','申':'壬','酉':'庚','戌':'丙','亥':'甲','子':'壬','丑':'庚'};
        if(wolDuk[monthZhi] === gan) s.push({type:'noble', name:'월덕귀인'});

        // 문창귀인/학당귀인
        const munchang = {'甲':'巳','乙':'午','丙':'申','丁':'酉','戊':'申','己':'酉','庚':'亥','辛':'子','壬':'寅','癸':'卯'};
        if(munchang[meGan] === zhi) s.push({type:'noble', name:'문창귀인'});

        // 홍염살 (일간 기준)
        const hong = {'甲':'午','乙':'午','丙':'寅','丁':'未','戊':'辰','己':'辰','庚':'戌','辛':'酉','壬':'申','癸':'申'};
        if(hong[meGan] === zhi) s.push({type:'spec', name:'홍염살'});

        // 현침살
        if(['甲','辛','卯','午','申'].includes(gan) || ['甲','辛','卯','午','申'].includes(zhi)) s.push({type:'spec', name:'현침살'});

        // 낙정관살
        const nak = {'甲':'巳','乙':'子','丙':'戌','丁':'未','戊':'卯','己':'申','庚':'酉','辛':'午','壬':'辰','癸':'亥'};
        if(nak[meGan] === zhi) s.push({type:'spec', name:'낙정관살'});

        // 12신살 (년지 기준)
        const order = ["겁살","재살","천살","지살","년살(도화)","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
        const start = {'亥':'亥','卯':'亥','未':'亥','寅':'寅','午':'寅','戌':'寅','巳':'巳','酉':'巳','丑':'巳','申':'申','子':'申','辰':'申'}[yearZhi];
        let diff = (this.ZHIS.indexOf(zhi) - this.ZHIS.indexOf(start) + 12) % 12;
        s.push({type:'12sal', name: order[diff]});

        return s;
    },

    // 5. 종합 분석 실행 함수 (Main Entry)
    analyzePillar: function(idPillar, pillar, allPillars, meGan, meZhi, yearZhi, monthZhi) {
        if(pillar === "??") return null;
        
        return {
            shinsin: idPillar === 'd' ? '日干' : this.getShinsin(meGan, pillar[0]),
            nabum: this.NABUM_MAP[pillar] || "",
            un12: this.TWELVE_MAP[meGan][pillar[1]] || "",
            isVoid: this.getGongmang(meGan + meZhi).includes(pillar[1]),
            interactions: this.getInteractions(allPillars, pillar[1]),
            shinsal: this.getShinsal(meGan, meZhi, yearZhi, monthZhi, pillar, idPillar)
        };
    }
};