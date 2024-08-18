"use client";
import { useState } from 'react';
import SectionB from "@/components/questionPapers/SectionB";
import SectionC from "@/components/questionPapers/SectionC";
import SectionD from "@/components/questionPapers/SectionD";
import SectionE from "@/components/questionPapers/SectionE";
import { Button } from "@nextui-org/react";
import { FaMotorcycle, FaCar, FaTruck } from 'react-icons/fa'; // Import icons

export function QuestionView() {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [sectionScores, setSectionScores] = useState({ sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0 });

    const handleSectionScore = (section: string, score: number) => {
        setSectionScores(prevScores => ({
            ...prevScores,
            [section]: score,
        }));
    };

    const handleSubmit = () => {
        const finalScore = Object.values(sectionScores).reduce((acc, curr) => acc + curr, 0);
        setTotalScore(finalScore);
        setSubmitted(true);
        console.log("Total Score:", finalScore);
    };

    return (
        <>
            {!selectedCode && ( // Render code selection buttons
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-4xl mb-4 text-center">Select Learners Licence Code</h2>
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-4">
                        <Button color="primary" variant="flat" onClick={() => setSelectedCode('Code 1')} startContent={<FaMotorcycle />}>
                            Code 1
                        </Button>
                        <Button color="primary" variant="flat" onClick={() => setSelectedCode('Code 2')} startContent={<FaCar />}>
                            Code 2
                        </Button>
                        <Button color="primary" variant="flat" onClick={() => setSelectedCode('Code 3')} startContent={<FaTruck />}>
                            Code 3
                        </Button>
                    </div>
                </div>
            )}

            {selectedCode && !selectedSet && ( // Render set selection buttons if a code is selected but not a set
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-4xl mb-4 text-center">Select Question Paper</h2>
                    <Button color="secondary" variant="flat" onClick={() => setSelectedCode(null)}>
                        Back to Licence Code Selection
                    </Button>
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-4">
                        <Button color="primary" variant="flat" onClick={() => setSelectedSet('A')}>
                            A
                        </Button>
                        <Button color="primary" variant="flat" onClick={() => setSelectedSet('B')}>
                            B
                        </Button>
                        <Button color="primary" variant="flat" onClick={() => setSelectedSet('C')}>
                            C
                        </Button>
                    </div>
                </div>
            )}

            {selectedSet && ( // Render appropriate sections based on selected code and set
                <>
                    <Button color="secondary" variant="flat" onClick={() => setSelectedSet(null)}>
                        Back to Question Paper Selection
                    </Button>

                    <h3 className="text-2xl font-semibold text-center">
                        SECTION B – SIGNS – ALL CODES
                    </h3>
                    <SectionB selectedSet={selectedSet} onScoreChange={(score) => handleSectionScore('sectionB', score)} />

                    <h3 className="text-2xl font-semibold text-center">
                        SECTION C – RULES – ALL CODES
                    </h3>
                    <SectionC selectedSet={selectedSet} onScoreChange={(score) => handleSectionScore('sectionC', score)} />

                    {selectedCode === 'Code 1' && (
                        <>
                            <h3 className="text-2xl font-semibold text-center">
                                SECTION D - MOTOR CYCLES ONLY
                            </h3>
                            <SectionD selectedSet={selectedSet} onScoreChange={(score) => handleSectionScore('sectionD', score)} />
                        </>
                    )}

                    {(selectedCode === 'Code 2' || selectedCode === 'Code 3') && (
                        <>
                            <h3 className="text-2xl font-semibold text-center">
                                SECTION E – LIGHT AND HEAVY VEHICLES ONLY
                            </h3>
                            <SectionE selectedSet={selectedSet} onScoreChange={(score) => handleSectionScore('sectionE', score)} />
                        </>
                    )}

                    <Button color="primary" variant="flat" onClick={handleSubmit}>
                        Submit
                    </Button>

                    {submitted && (
                        <p className="text-2xl font-semibold text-center">Total Score: {totalScore}</p>
                    )}
                </>
            )}
        </>
    );
}
