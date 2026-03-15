/**
 * BaziMaster Main Controller
 * 수정 내용: window 객체를 활용하여 다른 파일(Interactions 등)과 객체를 공유합니다.
 */

// [수정 포인트 1] 상단에 이 문구를 추가하세요 (기존 const BaziMaster = { 부분은 지웁니다)
window.BaziMaster = window.BaziMaster || {};

/**
 * 최종 사주 분석 실행 함수
 * [수정 포인트 2] 객체 내부 정의 방식에서 외부 할당 방식으로 변경
 */
BaziMaster.analyze = function(input) {
    const { birth, term, gender, pillars } = input;
    const yearPillar = pillars[0];
    const monthPillar = pillars[1];
    const dayPillar = pillars[2];
    const hourPillar = pillars[3];
    
    const meGan = dayPillar[0]; // 일간
    const meZhi = dayPillar[1]; // 일지
    const yearZhi = yearPillar[1]; // 년지 (12신살 기준)
    
    const allGans = pillars.map(p => p[0]);
    const allZhis = pillars.map(p => p[1]);

    // 1. 원국 기본 분석 (십신, 12운성, 지장간)
    let wonkuk = pillars.map((p, idx) => {
        const zhi = p[1];
        return {
            pillar: p,
            ssGan: idx === 2 ? "본인" : BaziCore.getSS(meGan, p[0]),
            ssZhi: BaziCore.getSS(meGan, p[1]),
            twelveCycle: BaziData.TWELVE_MAP[meGan][zhi],
            jijang: BaziCore.getJijangganInfo(zhi, allGans),
            naeum: BaziData.NAEUM_MAP[p]
        };
    });

    // 2. 오행 및 조후 분석
    const balance = BaziCore.analyzeBalance(pillars);

    // 3. 관계 및 신살 분석 (형/파/해/원진/귀문 포함)
    let interactions = [];
    allZhis.forEach(zhi => {
        // [참고] BaziInteractions.js가 먼저 로드되어 있어야 이 함수를 찾을 수 있습니다.
        if (BaziMaster.getInteractions) {
            const res = BaziMaster.getInteractions(allZhis, zhi);
            if (res.length > 0) interactions.push(...res);
        }
    });

    // 4. 기둥별 신살 및 귀인 추출
    let shinsalResults = pillars.map((p, idx) => {
        return {
            nobility: BaziMaster.getNobility ? BaziMaster.getNobility(meGan, monthPillar[1], p[1], p[0]) : [],
            energy: BaziMaster.getStrongEnergy ? BaziMaster.getStrongEnergy(p, meGan) : [],
            twelveSal: BaziMaster.getIntegrated12Sal ? BaziMaster.getIntegrated12Sal(yearZhi, p[1]) : ""
        };
    });

    // 5. 예측 데이터 (대운수, 공망)
    const daewun = BaziCore.getPreciseDaewun(birth, term, gender, yearPillar[0]);
    const gongmang = BaziCore.getGongmang(meGan, meZhi);

    // 최종 데이터 조립
    return {
        metadata: { gender, birth, daewunDirection: daewun.direction },
        wonkuk: wonkuk,
        balance: balance,
        interactions: [...new Set(interactions.map(i => i.name))], 
        shinsal: shinsalResults,
        daewunNum: daewun.exact,
        gongmang: gongmang,
        summary: `대운수는 ${daewun.exact}이며, 공망은 ${gongmang.join(', ')}입니다.`
    };
}; // [수정 포인트 3] 세미콜론으로 마무리
