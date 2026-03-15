window.BaziMaster = window.BaziMaster || {};

BaziMaster.analyze = function(input) {
    const { birth, term, gender, pillars } = input;
    
    const meGan = pillars[2][0];  // 일간
    const meZhi = pillars[2][1];  // 일지
    const yearZhi = pillars[0][1]; // 년지
    
    // 1. 원국 구성
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

    // 2. 신살 계산 (모든 기둥 순회)
    let shinsalResults = pillars.map((p, idx) => {
        // 12신살은 년지/일지 기준 배열로 받아옴
        const twelveSalArray = BaziMaster.getIntegrated12Sal(yearZhi, meZhi, p[1]);
        
        return {
            // 귀인 로직에 현재 기둥(p) 전체와 지지(p[1])를 정확히 전달
            nobility: BaziMaster.getNobility(meGan, p[1], p[0], p),
            energy: BaziMaster.getStrongEnergy(p),
            // UI 출력을 위해 콤마로 연결된 문자열로 변환
            twelveSal: Array.isArray(twelveSalArray) ? twelveSalArray.join(',') : twelveSalArray
        };
    });

    // 3. 전체 결과 반환
    return {
        metadata: { gender, birth },
        wonkuk: wonkuk,
        shinsal: shinsalResults,
        // 지지 간 상호작용 (원진, 귀문 등)
        interactions: [...new Set(pillars.map(p => BaziMaster.getInteractions(pillars.map(x=>x[1]), p[1])).flat().map(i => i.name))],
        daewunNum: BaziCore.getPreciseDaewun(birth, term, gender, pillars[0][0]).exact,
        gongmang: BaziCore.getGongmang(meGan, meZhi)
    };
};