/**
 * BaziMaster Core Engine
 * 기능: 십신 계산, 오행 점수, 정밀 대운수, 공망, 지장간 추출
 */

const BaziCore = {
    // 1. 십신(十神) 계산
    getSS: function(meGan, targetGan) {
        if (!meGan || !targetGan) return "";
        const meType = BaziData.ELEMENTS[meGan];
        const targetType = BaziData.ELEMENTS[targetGan];
        const meSide = BaziData.YIN_YANG[meGan];
        const targetSide = BaziData.YIN_YANG[targetGan];
        
        const relations = {
            'wood': {'wood':'비겁', 'fire':'식상', 'earth':'재성', 'metal':'관성', 'water':'인성'},
            'fire': {'fire':'비겁', 'earth':'식상', 'metal':'재성', 'water':'관성', 'wood':'인성'},
            'earth': {'earth':'비겁', 'metal':'식상', 'water':'재성', 'wood':'관성', 'fire':'인성'},
            'metal': {'metal':'비겁', 'water':'식상', 'wood':'재성', 'fire':'관성', 'earth':'인성'},
            'water': {'water':'비겁', 'wood':'식상', 'fire':'재성', 'earth':'관성', 'metal':'인성'}
        };

        const base = relations[meType][targetType];
        if (base === '비겁') return meSide === targetSide ? '비견' : '겁재';
        if (base === '식상') return meSide === targetSide ? '식신' : '상관';
        if (base === '재성') return meSide === targetSide ? '편재' : '정재';
        if (base === '관성') return meSide === targetSide ? '편관' : '정관';
        if (base === '인성') return meSide === targetSide ? '편인' : '정인';
        return base;
    },

    // 2. 오행 비율 및 분포 분석 (용희기구신 기초)
    analyzeBalance: function(allPillars) {
        let scores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
        allPillars.forEach(p => {
            if (p && p.length === 2) {
                scores[BaziData.ELEMENTS[p[0]]]++;
                scores[BaziData.ELEMENTS[p[1]]]++;
            }
        });
        
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return {
            scores: scores,
            strongest: sorted[0][0],
            weakest: sorted[4][0]
        };
    },

    // 3. 정밀 대운수 계산 (소수점 2자리)
    getPreciseDaewun: function(birthStr, termStr, gender, yearGan) {
        const birth = new Date(birthStr);
        const term = new Date(termStr);
        const isYangYear = "甲丙戊庚壬".includes(yearGan);
        const isForward = (gender === 'M' && isYangYear) || (gender === 'F' && !isYangYear);
        
        const diffMs = Math.abs(birth - term);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        const exactNum = diffDays / 3;
        
        return {
            num: Math.round(exactNum) || 1,
            exact: exactNum.toFixed(2),
            direction: isForward ? "순행" : "역행"
        };
    },

    // 4. 지장간 및 투출 정보 추출
    getJijangganInfo: function(zhi, heavenGans) {
        const data = BaziData.JIJANG_MAP[zhi];
        let result = {
            list: [data.early, data.mid, data.main].filter(v => v !== null),
            tuchul: [] // 천간에 투출된 글자들
        };
        
        result.list.forEach(g => {
            if (heavenGans.includes(g)) result.tuchul.push(g);
        });
        
        return result;
    },

    // 5. 공망 계산 (일주 기준)
    getGongmang: function(meGan, meZhi) {
        const gIdx = BaziData.GANS.indexOf(meGan);
        const zIdx = BaziData.ZHIS.indexOf(meZhi);
        const startZIdx = (zIdx - gIdx + 12) % 12;
        
        return [
            BaziData.ZHIS[(startZIdx + 10) % 12],
            BaziData.ZHIS[(startZIdx + 11) % 12]
        ];
    }
};