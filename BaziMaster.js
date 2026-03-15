/**
 * BaziMaster Main Controller
 */
window.BaziMaster = window.BaziMaster || {};

BaziMaster.analyze = function(input) {
    const { birth, term, gender, pillars } = input;
    const yearPillar = pillars[0];
    const monthPillar = pillars[1];
    const dayPillar = pillars[2];
    const hourPillar = pillars[3];
    
    const meGan = dayPillar[0]; 
    const meZhi = dayPillar[1]; 
    const yearZhi = yearPillar[1]; 
    
    const allGans = pillars.map(p => p[0]);
    const allZhis = pillars.map(p => p[1]);

    // 1. 원국 분석
    let wonkuk = pillars.map((p, idx) => {
        const zhi = p[1];
        return {
            pillar: p,
            ssGan: idx === 2 ? "본인" : BaziCore.getSS(meGan, p[0]),
            ssZhi: BaziCore.getSS(meGan, p[1]),
            twelveCycle: (BaziData.TWELVE_MAP[meGan] && BaziData.TWELVE_MAP[meGan][zhi]) || "",
            jijang: BaziCore.getJijangganInfo(zhi, allGans),
            naeum: BaziData.NAEUM_MAP[p] || ""
        };
    });

    // 2. 오행 분석
    const balance = BaziCore.analyzeBalance(pillars);

    // 3. 관계 분석
    let interactions = [];
    allZhis.forEach(zhi => {
        if(BaziMaster.getInteractions) {
            const res = BaziMaster.getInteractions(allZhis, zhi);
            if (res.length > 0) interactions.push(...res);
        }
    });

    // 4. 신살 및 귀인 추출
    let shinsalResults = pillars.map((p, idx) => {
        return {
            nobility: BaziMaster.getNobility ? BaziMaster.getNobility(meGan, monthPillar[1], p[1], p[0]) : [],
            energy: BaziMaster.getStrongEnergy ? BaziMaster.getStrongEnergy(p, meGan) : [],
            twelveSal: BaziMaster.getIntegrated12Sal ? BaziMaster.getIntegrated12Sal(yearZhi, p[1]) : ""
        };
    });

    const daewun = BaziCore.getPreciseDaewun(birth, term, gender, yearPillar[0]);
    const gongmang = BaziCore.getGongmang(meGan, meZhi);

    return {
        metadata: { gender, birth, daewunDirection: daewun.direction },
        wonkuk: wonkuk,
        balance: balance,
        interactions: [...new Set(interactions.map(i => i.name))], 
        shinsal: shinsalResults,
        daewunNum: daewun.exact,
        gongmang: gongmang,
        summary: `대운수: ${daewun.exact}, 공망: ${gongmang.join(', ')}`
    };
};