window.BaziMaster = window.BaziMaster || {};

BaziMaster.analyze = function(input) {
    const { birth, term, gender, pillars } = input;
    
    const meGan = pillars[2][0];  // 일간
    const meZhi = pillars[2][1];  // 일지
    const yearZhi = pillars[0][1]; // 년지
    
    // 원국 구성
    let wonkuk = pillars.map((p, idx) => {
        return {
            pillar: p,
            ssGan: idx === 2 ? "본인" : BaziCore.getSS(meGan, p[0]),
            ssZhi: BaziCore.getSS(meGan, p[1]),
            twelveCycle: BaziData.TWELVE_MAP[meGan][p[1]],
            jijang: BaziCore.getJijangganInfo(p[1], pillars.map(x=>x[0])),
            naeum: BaziData.NAEUM_MAP[p] || ""
        };
    });

    // 신살 계산 (모든 일주 공통 로직)
    let shinsalResults = pillars.map((p, idx) => {
        return {
            nobility: BaziMaster.getNobility(meGan, p[1], p[0], p),
            energy: BaziMaster.getStrongEnergy(p),
            twelveSal: BaziMaster.getIntegrated12Sal(yearZhi, meZhi, p[1])
        };
    });

    return {
        metadata: { gender, birth },
        wonkuk: wonkuk,
        shinsal: shinsalResults,
        interactions: [...new Set(pillars.map(p => BaziMaster.getInteractions(pillars.map(x=>x[1]), p[1])).flat().map(i => i.name))],
        daewunNum: BaziCore.getPreciseDaewun(birth, term, gender, pillars[0][0]).exact,
        gongmang: BaziCore.getGongmang(meGan, meZhi)
    };
};