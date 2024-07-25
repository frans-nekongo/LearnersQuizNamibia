"use client"
import {useState} from 'react';
import SectionB from "@/components/questionPapers/SectionB";
import SectionC from "@/components/questionPapers/SectionC";
import SectionD from "@/components/questionPapers/SectionD";
import SectionE from './questionPapers/SectionE';
import {Button} from "@nextui-org/react";
import {warn} from "@nextui-org/shared-utils";
import {Simulate} from "react-dom/test-utils";
import waiting = Simulate.waiting;
import {wait} from "next/dist/lib/wait";

export function QuestionView() {
    const [selectedSet, setSelectedSet] = useState(null); // Initialize with null to indicate no selection

    const [totalScore, setTotalScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const [sectionScores, setSectionScores] = useState({sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0});


   const handleSectionScore = (section: string, score: number):any => {
        setSectionScores((prevScores) => ({
            ...prevScores,
            [section]: score
        }));
    };

       const handleSubmit = () => {
        const finalScore = Object.values(sectionScores).reduce((acc, curr) => acc + curr, 0);
        setTotalScore(finalScore);
        setSubmitted(true);
        console.log("Total Score:", finalScore);
    };


    // @ts-ignore
    return (
        <>
            {!selectedSet && ( // Only render buttons if no selection has been made
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-4xl mb-4 text-center">Select Question paper</h2>

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

            {selectedSet && ( // Only render sections if a selection has been made
                <>
                    <h3 className="text-2xl font-semibold text-center">
                        SECTION B – SIGNS – ALL CODES
                    </h3>
                    <SectionB selectedSet={selectedSet} onScoreChange={(score) => handleSectionScore('sectionB', score)}/>

                    <h3 className="text-2xl font-semibold text-center">
                        SECTION C – RULES – ALL CODES
                    </h3>
                    <SectionC selectedSet={selectedSet}/>

                    <h3 className="text-2xl font-semibold text-center">
                        SECTION D - MOTOR CYCLES ONLY
                    </h3>
                    <SectionD selectedSet={selectedSet}/>

                    <h3 className="text-2xl font-semibold text-center">
                        SECTION E – LIGHT AND HEAVY VEHICLES ONLY
                    </h3>
                    <SectionE selectedSet={selectedSet}/>

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
