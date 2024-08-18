'use client';

import {useState, useEffect} from 'react';
import SectionB from '@/components/questionPapers/SectionB';
import SectionC from '@/components/questionPapers/SectionC';
import SectionD from '@/components/questionPapers/SectionD';
import SectionE from '@/components/questionPapers/SectionE';
import {Button, Switch} from '@nextui-org/react';
import {FaMotorcycle, FaCar, FaTruck} from 'react-icons/fa'; // Import icons

export function QuestionView() {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [sectionScores, setSectionScores] = useState({sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0});
    const [timerEnabled, setTimerEnabled] = useState(false); // State to manage timer toggle
    const [timeLeft, setTimeLeft] = useState<number | null>(null); // State for timer
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // State to store interval ID

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

        // Clear the timer if it exists
        if (intervalId) {
            clearInterval(intervalId);
        }
    };

    useEffect(() => {
        if (timerEnabled && selectedSet) {
            // Start the timer for 90 minutes (5400 seconds)
            const endTime = Date.now() + 90 * 60 * 1000;
            setTimeLeft(Math.max(Math.ceil((endTime - Date.now()) / 1000), 0));

            const id = setInterval(() => {
                const currentTime = Date.now();
                const timeRemaining = Math.max(Math.ceil((endTime - currentTime) / 1000), 0);
                setTimeLeft(timeRemaining);

                if (timeRemaining <= 0) {
                    clearInterval(id);
                    handleSubmit(); // Auto-submit when time is up
                }
            }, 1000);

            setIntervalId(id);

            return () => clearInterval(id); // Clean up on component unmount
        }
    }, [timerEnabled, selectedSet]);

    return (
        <>
            {!selectedCode && ( // Render code selection buttons
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-2xl md:text-4xl mb-4 text-center">Select Learners Licence Code</h2>
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-4">
                        <Button color="primary" variant="flat" onClick={() => setSelectedCode('Code 1')}
                                startContent={<FaMotorcycle/>}>
                            Code 1
                        </Button>
                        <Button color="primary" variant="flat" onClick={() => setSelectedCode('Code 2')}
                                startContent={<FaCar/>}>
                            Code 2
                        </Button>
                        <Button color="primary" variant="flat" onClick={() => setSelectedCode('Code 3')}
                                startContent={<FaTruck/>}>
                            Code 3
                        </Button>
                    </div>
                </div>
            )}

            {selectedCode && !selectedSet && ( // Render set selection buttons if a code is selected but not a set
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-2xl md:text-4xl mb-4 text-center">Select Question Paper</h2>

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

                    {/* Timer toggle switch */}
                    <div className="flex flex-row mt-4 w-full justify-end items-center space-x-4">
                        <label className="flex items-center">
                            <span className="mr-2">Enable Timer</span>
                            <Switch
                                isSelected={timerEnabled}
                                size="md"
                                onChange={() => setTimerEnabled(prev => !prev)}
                            />
                        </label>
                        <Button color="secondary" variant="flat" onClick={() => setSelectedCode(null)}>
                            Back
                        </Button>
                    </div>

                </div>
            )}

            {selectedSet && ( // Render appropriate sections based on selected code and set
                <>
                    <Button
                        className="fixed z-40 bottom-[20px] right-2 p-2 text-black dark:text-white"
                        color="default"
                        variant="faded"
                        onClick={() => setSelectedSet(null)}
                    >
                        Back
                    </Button>


                    <h3 className="text-2xl font-semibold text-center">
                        SECTION B – SIGNS – ALL CODES
                    </h3>
                    <div className="z-0">
                        <SectionB
                            selectedSet={selectedSet}
                            onScoreChange={(score) => handleSectionScore('sectionB', score)}
                            onSubmit={() => {
                                handleSubmit();
                            }}
                            submitted={submitted}/>
                    </div>


                    <h3 className="text-2xl font-semibold text-center">
                        SECTION C – RULES – ALL CODES
                    </h3>
                    <SectionC selectedSet={selectedSet}
                              onScoreChange={(score) => handleSectionScore('sectionC', score)}/>

                    {selectedCode === 'Code 1' && (
                        <>
                            <h3 className="text-2xl font-semibold text-center">
                                SECTION D - MOTOR CYCLES ONLY
                            </h3>
                            <SectionD selectedSet={selectedSet}
                                      onScoreChange={(score) => handleSectionScore('sectionD', score)}/>
                        </>
                    )}

                    {(selectedCode === 'Code 2' || selectedCode === 'Code 3') && (
                        <>
                            <h3 className="text-2xl font-semibold text-center">
                                SECTION E – LIGHT AND HEAVY VEHICLES ONLY
                            </h3>
                            <SectionE selectedSet={selectedSet}
                                      onScoreChange={(score) => handleSectionScore('sectionE', score)}/>
                        </>
                    )}

                    <Button key="submit button" color="primary" variant="flat" onClick={handleSubmit}>
                        Submit
                    </Button>

                    {submitted && (
                        <p className="text-2xl font-semibold text-center">Total Score: {totalScore}</p>
                    )}

                    {/* Timer overlay */}
                    {timerEnabled && timeLeft !== null && (
                        <div
                            className="fixed z-1000 top-[65px] right-0 m-4 bg-black text-white dark:bg-white dark:text-black ] p-2 rounded-md shadow-lg">
                            <p className="text-lg">
                                Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                            </p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
