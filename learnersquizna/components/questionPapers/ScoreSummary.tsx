import React from 'react';

interface ScoreSummaryProps {
    totalScore: number;
    percentage: string;
    sectionScores: {
        sectionA: number;
        sectionB: number;
        sectionC: number;
        sectionD?: number;
        sectionE?: number;
    };
    sectionTotals: {
        sectionA: number;
        sectionB: number;
        sectionC: number;
        sectionD?: number;
        sectionE?: number;
    };
    selectedCode: string | null;
    getWeakestSectionMessage: () => string;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({
    totalScore,
    percentage,
    sectionScores,
    sectionTotals,
    selectedCode,
    getWeakestSectionMessage,
}) => {
    // Calculate total sections based on selected code
    let totalSections = 0;

    // Always include section A, B, and C
    totalSections += sectionTotals.sectionA || 0;
    totalSections += sectionTotals.sectionB || 0;
    totalSections += sectionTotals.sectionC || 0;

    // Conditionally include section D or E
    if (selectedCode === 'Code 2' || selectedCode === 'Code 3') {
        totalSections += sectionTotals.sectionE || 0;
    } else if (selectedCode === 'Code 1') {
        totalSections += sectionTotals.sectionD || 0;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            {/* Total Score Section */}
            <div className="text-center mb-4">
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                    Total: {percentage}%
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Score: {totalScore}/{totalSections}
                </p>
            </div>

            {/* Section Scores */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>SECTION A: PRACTICE QUESTIONS:</span>
                    <span>{sectionScores.sectionA}/{sectionTotals.sectionA}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>SECTION B – SIGNS – ALL CODES:</span>
                    <span>{sectionScores.sectionB}/{sectionTotals.sectionB}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>SECTION C – RULES – ALL CODES:</span>
                    <span>{sectionScores.sectionC}/{sectionTotals.sectionC}</span>
                </div>
                {selectedCode === 'Code 1' && sectionTotals.sectionD !== undefined && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>SECTION D - MOTOR CYCLES ONLY:</span>
                        <span>{sectionScores.sectionD}/{sectionTotals.sectionD}</span>
                    </div>
                )}
                {(selectedCode === 'Code 2' || selectedCode === 'Code 3') && sectionTotals.sectionE !== undefined && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>SECTION E – LIGHT AND HEAVY VEHICLES ONLY:</span>
                        <span>{sectionScores.sectionE}/{sectionTotals.sectionE}</span>
                    </div>
                )}
            </div>

            {/* Weakest Section Advice */}
            <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    You need to {getWeakestSectionMessage()}.
                </p>
            </div>
        </div>
    );
};

export default ScoreSummary;
