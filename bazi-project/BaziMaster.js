/**
 * BaziMaster Main Controller
 * 기능: Core와 Interaction 로직을 조립하여 최종 분석 결과 생성
 */

const BaziMaster = {
    /**
     * 최종 사주 분석 실행 함수
     * @param {Object} input - { birth: "YYYY-MM-DD HH:mm", term: "절입시간", gender: "M/F", pillars: ["甲子", "丙寅", ...] }
     */
    analyze: function(input) {
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
            const res = BaziMaster.getInteractions(allZhis, zhi);
            if (res.length > 0) interactions.push(...res);
        });

        // 4. 기둥별 신살 및 귀인 추출
        let shinsalResults = pillars.map((p, idx) => {
            return {
                nobility: BaziMaster.getNobility(meGan, monthPillar[1], p[1], p[0]),
                energy: BaziMaster.getStrongEnergy(p, meGan),
                twelveSal: BaziMaster.getIntegrated12Sal(yearZhi, p[1])
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
            interactions: [...new Set(interactions.map(i => i.name))], // 중복 제거된 관계 리스트
            shinsal: shinsalResults,
            daewunNum: daewun.exact,
            gongmang: gongmang,
            summary: `대운수는 ${daewun.exact}이며, 공망은 ${gongmang.join(', ')}입니다.`
        };
    }
};