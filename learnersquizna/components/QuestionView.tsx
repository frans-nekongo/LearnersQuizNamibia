'use client';

import {useState, useEffect, useRef} from 'react';
import SectionB from '@/components/questionPapers/SectionB';
import SectionC from '@/components/questionPapers/SectionC';
import SectionD from '@/components/questionPapers/SectionD';
import SectionE from '@/components/questionPapers/SectionE';
import {Button, Switch, Modal, useDisclosure} from '@nextui-org/react';
import {FaMotorcycle, FaCar, FaTruck} from 'react-icons/fa';
import {ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal"; // Import icons

type SectionKey = 'sectionB' | 'sectionC' | 'sectionD' | 'sectionE';

export function QuestionView() {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [sectionScores, setSectionScores] = useState({sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0});
    const [timerEnabled, setTimerEnabled] = useState(true); // State to manage timer toggle
    const [timeLeft, setTimeLeft] = useState<number | null>(null); // State for timer
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // State to store interval ID

    const {isOpen, onOpen, onClose} = useDisclosure(); // UseDisclosure for modal control
    const timerSwitchRef = useRef<HTMLDivElement | null>(null); // Ref for timer switch container
    const [isInitialRender, setIsInitialRender] = useState(true); // State to track initial render

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

        // Set the timer to zero
        setTimeLeft(0);
    };
    const getWeakestSectionMessage = (): string => {
        let relevantSections: SectionKey[] = ['sectionB', 'sectionC'];

        if (selectedCode === 'Code 1') {
            relevantSections.push('sectionD');
        } else if (selectedCode === 'Code 2' || selectedCode === 'Code 3') {
            relevantSections.push('sectionE');
        }

        let weakestSection: SectionKey = relevantSections[0];

        relevantSections.forEach(section => {
            if (sectionScores[section] < sectionScores[weakestSection]) {
                weakestSection = section;
            }
        });

        switch (weakestSection) {
            case 'sectionB':
                return 'work on signs';
            case 'sectionC':
                return 'work on rules';
            case 'sectionD':
                return 'work on motorcycles';
            case 'sectionE':
                return 'work on light and heavy vehicles';
            default:
                return 'improve your performance';
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

    useEffect(() => {
        if (isInitialRender && timerSwitchRef.current && window.innerWidth <= 768) {
            timerSwitchRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'});
            setIsInitialRender(false); // Update state to prevent further scroll into view actions
        }
    }, [isInitialRender, timerEnabled, selectedSet]);

    return (
        <>
            {!selectedCode && ( // Render code selection buttons
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-2xl md:text-4xl mb-4 text-center">Select Learners Licence Code</h2>
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-4">
                        <Button color="success" variant="bordered" onClick={() => setSelectedCode('Code 1')}
                                startContent={<FaMotorcycle/>}>
                            Code 1
                        </Button>
                        <Button color="warning" variant="bordered" onClick={() => setSelectedCode('Code 2')}
                                startContent={<FaCar/>}>
                            Code 2
                        </Button>
                        <Button color="danger" variant="bordered" onClick={() => setSelectedCode('Code 3')}
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
                        <Button className="border-black dark:border-white" variant="bordered"
                                onClick={() => setSelectedSet('A')}>
                            A
                        </Button>

                        <Button className="border-black dark:border-white" variant="bordered"
                                onClick={() => setSelectedSet('B')}>
                            B
                        </Button>

                        <Button className="border-black dark:border-white" variant="bordered"
                                onClick={() => setSelectedSet('C')}>
                            C
                        </Button>
                    </div>

                    {/* Timer toggle switch */}
                    <div
                        key="Timeswitch"
                        className="flex flex-row w-full justify-end items-center "
                        ref={timerSwitchRef}
                    >
                        <label className="flex items-center">
                            <span className="mr-2">Enable Timer</span>
                            <Switch
                                color={"success"}
                                isSelected={timerEnabled}
                                size="sm"
                                onChange={() => setTimerEnabled(prev => !prev)}
                            />
                        </label>
                        <Button key="BackToSelectLearnersCode" size={"sm"} variant="flat"
                                onClick={() => setSelectedCode(null)}>
                            Back
                        </Button>
                    </div>
                </div>
            )}

            {selectedSet && ( // Render appropriate sections based on selected code and set
                <>
                    <Button
                        key="BackToSelectQuestionPaper"
                        className="fixed z-40 bottom-[20px] right-2 p-2 text-black dark:text-white"
                        color="default"
                        variant="faded"
                        onClick={onOpen} // Show confirmation dialog
                    >
                        Back/exit test
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
                        <div>
                            <p className=" text-2xl font-semibold  text-center">Total Score: {totalScore}</p>
                            <p className="text-sm font-light text-center">SECTION B – SIGNS – ALL
                                CODES: {sectionScores.sectionB}</p>
                            <p className="text-sm font-light text-center">SECTION C – RULES – ALL
                                CODES: {sectionScores.sectionC}</p>
                            {selectedCode === 'Code 1' && (
                                <p className="text-sm font-light text-center">SECTION D - MOTOR CYCLES
                                    ONLY: {sectionScores.sectionD}</p>
                            )}
                            {(selectedCode === 'Code 2' || selectedCode === 'Code 3') && (
                                <p className="text-sm font-light text-center">SECTION E – LIGHT AND HEAVY VEHICLES
                                    ONLY: {sectionScores.sectionE}</p>
                            )}

                            {/* Weakest Section Advice */}
                            <div className="mt-4 text-center">
                                <p className="text-lg font-bold text-red-600">
                                    You need to {getWeakestSectionMessage()}.
                                </p>
                            </div>

                        </div>
                    )}


                    {/* Timer overlay */}
                    {timerEnabled && timeLeft !== null && (
                        <div
                            className="fixed z-1000 top-[30px] md:top-[55px] right-0 m-4 bg-black text-white dark:bg-white dark:text-black p-2 rounded-md shadow-lg">
                            <p className="text-lg">
                                Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                            </p>
                        </div>
                    )}

                    {/* Confirmation Dialog */}
                    <Modal
                        backdrop="opaque"
                        isOpen={isOpen}
                        onOpenChange={onClose}
                    >
                        <ModalContent>
                            <ModalHeader>Confirmation</ModalHeader>
                            <ModalBody>
                                Are you sure you want to leave or stop the test in progress?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" variant="light" onClick={() => {
                                    setSelectedSet(null);
                                    setSubmitted(false);
                                    setSectionScores({sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0}); // Reset section scores
                                    setTotalScore(0); // Reset total score to zero
                                    onClose();
                                }}>
                                    Yes
                                </Button>
                                <Button onClick={onClose}>
                                    No
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    );
}
