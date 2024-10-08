'use client';

import {useState, useEffect, useRef} from 'react';
import SectionB from '@/components/questionPapers/SectionB';
import SectionC from '@/components/questionPapers/SectionC';
import SectionD from '@/components/questionPapers/SectionD';
import SectionE from '@/components/questionPapers/SectionE';
import SectionA from '@/components/questionPapers/SectionA';
import {Button, Switch, Modal, useDisclosure} from '@nextui-org/react';
import {FaMotorcycle, FaCar, FaTruck, FaSign, FaArrowLeft, FaChevronCircleLeft} from 'react-icons/fa';
import {ModalBody, ModalContent, ModalFooter, ModalHeader} from '@nextui-org/modal';
import {useTestsLeft} from '@/components/useTestsLeft';
import ScoreSummary from '@/components/questionPapers/ScoreSummary';
import {ExtraTests} from '@/components/questionPapers/ExtraTests';
import LayoutToggle from "@/components/questionPapers/LayoutToggle";

type SectionKey = 'sectionA' | 'sectionB' | 'sectionC' | 'sectionD' | 'sectionE';

export function QuestionView() {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [sectionScores, setSectionScores] = useState({
        sectionA: 0,
        sectionB: 0,
        sectionC: 0,
        sectionD: 0,
        sectionE: 0
    });
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [clickCount, setClickCount] = useState(0);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showExtraTests, setShowExtraTests] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const timerSwitchRef = useRef<HTMLDivElement | null>(null);
    const [isInitialRender, setIsInitialRender] = useState(true);

    const {testsLeft, decrementTestsLeftLocally, refreshTestsLeft} = useTestsLeft();

    const determineInitialLayout = () => {
        // Adjust the threshold value as needed (e.g., 768px for tablets and above)
        return window.innerWidth >= 768;
    };

// Initialize state with a function to check screen width
    const [isGridLayout, setIsGridLayout] = useState(determineInitialLayout);

    const userHasToggled = useRef(false);  // <-- Add this here to initialize the ref

    const handleLayoutChange = (newLayout: boolean) => {
        setIsGridLayout(newLayout);
    };

    const handleUserToggle = (newLayout: boolean) => {
        userHasToggled.current = true;  // <-- This line sets the ref when the user toggles manually
        handleLayoutChange(newLayout);  // Proceed with normal layout change logic
    };

    // Specify the ref type as HTMLDivElement | null
    const scoreSummaryRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const handleResize = () => {
            // Only set the layout based on screen size if the user has not toggled manually
            if (!userHasToggled.current) {
                setIsGridLayout(determineInitialLayout());
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Your component logic here

    useEffect(() => {
        if (timerEnabled && selectedSet) {
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

            return () => clearInterval(id);
        }
    }, [timerEnabled, selectedSet]);

    useEffect(() => {
        if (isInitialRender && timerSwitchRef.current && window.innerWidth <= 768) {
            timerSwitchRef.current.scrollIntoView({behavior: 'smooth', block: 'nearest'});
            setIsInitialRender(false);
        }
    }, [isInitialRender, timerEnabled, selectedSet]);

    const handleSectionScore = (section: SectionKey, score: number) => {
        setSectionScores(prevScores => ({
            ...prevScores,
            [section]: score,
        }));
    };

    const handleSubmit = async () => {
        const finalScore = Object.values(sectionScores).reduce((acc, curr) => acc + curr, 0);
        setTotalScore(finalScore);
        setSubmitted(true);
        setIsButtonDisabled(true);

        await decrementTestsLeftLocally();
        console.log("Total Score:", finalScore);

        if (intervalId) {
            clearInterval(intervalId);
        }

        setTimeLeft(0);

        // Scroll into view after submission
        if (scoreSummaryRef.current) {
            scoreSummaryRef.current.scrollIntoView({behavior: 'smooth'});
        }
    };

    const getWeakestSectionMessage = (): string => {
        const relevantSections: SectionKey[] = ['sectionB', 'sectionC'];
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

    const handleDisabledButtonClick = () => {
        setClickCount(prevCount => {
            const newCount = prevCount + 1;
            if (newCount > 3) {
                setShowPurchaseModal(true);
            }
            return newCount;
        });
    };

    const handleExitButtonClick = async () => {
        await refreshTestsLeft();
        onOpen();
    };

    const text = `${testsLeft} test${testsLeft === 1 ? '' : 's'} left`;
    const showBuyMoreTestsMessage = testsLeft !== null && testsLeft < 1 && !selectedCode && !showExtraTests;

    const sectionTotals = {
        sectionA: 3,
        sectionB: 43,
        sectionC: 24,
        sectionD: 8,
        sectionE: 12
    };


    // console.log("Section A:", sectionTotals.sectionA);
    // console.log("Section B:", sectionTotals.sectionB);
    // console.log("Section C:", sectionTotals.sectionC);
    // console.log("Section D:", sectionTotals.sectionD);
    // console.log("Section E:", sectionTotals.sectionE);

    const totalQuestions = sectionTotals.sectionA + sectionTotals.sectionB + sectionTotals.sectionC +
        (selectedCode === 'Code 1' ? sectionTotals.sectionD : 0) +
        ((selectedCode === 'Code 2' || selectedCode === 'Code 3') ? sectionTotals.sectionE : 0);


    // const percentage = totalScore > 0 ? ((Math.min(totalScore / totalQuestions, 1) * 100).toFixed(2)) : '0';
    const percentage = totalQuestions > 0 ? ((totalScore / totalQuestions) * 100).toFixed(2) : '0.00';


    // console.log("Total Score:", totalScore);
    // console.log("Total Questions:", totalQuestions);
    // console.log("Calculated Percentage:", percentage);


    return (
        <>
            <div key="number of tests left"
                 className="absolute z-1000 top-[30px] md:top-[55px] left-[0px] m-4 text-black dark:text-white p-2 rounded-md shadow-lg bg-[#E6E9EA] dark:bg-btn-background">
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <div className="flex flex-row justify-center items-center w-full">
                        <div className="flex-grow text-center text-sm">
                            <p>
                                {typeof testsLeft === 'number' ? text : 'Loading...'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            {showBuyMoreTestsMessage && (
                <div
                    className="text-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md shadow-md">
                    <span className="font-semibold text-lg">You ran out of tests!</span>
                    <p className="mt-2">Please purchase more to continue.</p>
                </div>

            )}

            {!selectedCode && !showExtraTests && ( // Hide options if `showExtraTests` is true
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-2xl md:text-4xl mb-4 text-center">Select Learners Licence Code</h2>
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-4">
                        <Button
                            className="border-[#01A093] transform transition-transform duration-300 hover:scale-105 hover:bg-[#01A093] hover:text-white"
                            variant="bordered"
                            onClick={() => {
                                setTimeout(() => {
                                    setSelectedCode('Code 1');
                                }, 500);
                            }}
                            startContent={<FaMotorcycle/>}>
                            Code 1
                        </Button>

                        <Button
                            className="border-[#F4AB30] transform transition-transform duration-300 hover:scale-105 hover:bg-[#F4AB30] hover:text-white"
                            variant="bordered"
                            onClick={() => {
                                setTimeout(() => {
                                    setSelectedCode('Code 2');
                                }, 500);
                            }}
                            startContent={<FaCar/>}
                        >
                            Code 2
                        </Button>


                        <Button
                            className="border-[#CB011F] transform transition-transform duration-300 hover:scale-105 hover:bg-[#CB011F] hover:text-white"
                            variant="bordered"
                            onClick={() => {
                                setTimeout(() => {
                                    setSelectedCode('Code 3');
                                }, 500);
                            }}
                            startContent={<FaTruck/>}
                        >
                            Code 3
                        </Button>


                    </div>
                    {/*if road sign is pressed*/}
                    <div className="flex justify-center items-center h-full">
                        <Button
                            className="border-red-600 text-red-600 transform transition-transform duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
                            variant="bordered"
                            onClick={() => {
                                setTimeout(() => {
                                    setShowExtraTests(true);
                                }, 400);
                            }}
                            startContent={<FaSign/>}
                            disabled={testsLeft === null || testsLeft < 1} // Disable button if testsLeft is less than 1
                        >
                            SIGNS – ALL CODES
                        </Button>


                    </div>
                </div>
            )}

            {showExtraTests && (
                <>
                    <Button
                        className="fixed z-40 bottom-5 right-5 p-3 text-white bg-green-600 border border-white rounded-lg shadow-lg flex items-center space-x-2 transform rotate-[-5deg] transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                        color="default"
                        variant="bordered"
                        onClick={handleExitButtonClick} // Show confirmation dialog
                    >
                        <span className="font-bold text-xl">⬅️</span>
                        <span className="text-sm font-medium">Go Back</span>
                    </Button>


                    <ExtraTests/>
                </>
            )}


            {selectedCode && !selectedSet && ( // Render set selection buttons if a code is selected but not a set
                <div className="grid grid-flow-row-dense gap-5">
                    <h2 className="font-bold text-2xl md:text-4xl mb-4 text-center">Select Test Paper</h2>
                    <div className="grid grid-flow-row-dense grid-cols-3 gap-4">
                        <Button
                            className="border-black dark:border-white transform transition-transform duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            variant="bordered"
                            onClick={() => {
                                if (testsLeft === null || testsLeft < 1) {
                                    handleDisabledButtonClick();
                                } else {
                                    setSelectedSet('A');
                                }
                            }}
                            disabled={testsLeft === null || testsLeft < 1} // Disable button if testsLeft is less than 1
                        >
                            A
                        </Button>

                        <Button
                            className="border-black dark:border-white transform transition-transform duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            variant="bordered"
                            onClick={() => setSelectedSet('B')}
                            disabled={testsLeft === null || testsLeft < 1} // Disable button if testsLeft is less than 1
                        >
                            B
                        </Button>

                        <Button
                            className="border-black dark:border-white transform transition-transform duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                            variant="bordered"
                            onClick={() => setSelectedSet('C')}
                            disabled={testsLeft === null || testsLeft < 1} // Disable button if testsLeft is less than 1
                        >
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
                        <Button
                            key="BackToSelectLearnersCode"
                            size="sm"
                            className="border-2 border-black dark:border-white flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                            variant="bordered"
                            onClick={() => setSelectedCode(null)}
                        >
                            <FaArrowLeft className="text-lg"/>
                            Back
                        </Button>

                    </div>
                </div>
            )}

            {selectedSet && ( // Render appropriate sections based on selected code and set
                <>

                    <Button
                        key="BackToSelectQuestionPaper"
                        className="fixed z-40 bottom-4 right-4 p-3 text-white bg-red-600 border-2 border-yellow-400 rounded-full flex items-center gap-2 shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-red-700 hover:border-yellow-500"
                        color="default"
                        variant="faded"
                        onClick={onOpen} // Show confirmation dialog
                    >
                        <FaChevronCircleLeft className="text-2xl"/>
                        <span className="hidden md:inline">Back/Exit Test</span>
                    </Button>

                    <div className="flex justify-center mb-4 md:mb-8 lg:mb-8">
                        <div className="flex justify-center items-center">
                            <h3 className="text-xl font-bold text-center">SECTION A: PRACTICE QUESTIONS</h3>
                        </div>

                        <div className="ml-8 md:ml-8 lg:ml-8">
                            <LayoutToggle onLayoutChange={handleUserToggle} isGridLayout={isGridLayout}/>
                        </div>
                    </div>


                    <div className="z-0">
                        <SectionA
                            selectedSet={selectedSet}
                            onScoreChange={(score) => handleSectionScore('sectionA', score)}
                            onSubmit={() => {
                                handleSubmit();
                            }}
                            submitted={submitted}
                            isGridLayout={isGridLayout}/>
                    </div>

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
                            submitted={submitted}
                            isGridLayout={isGridLayout}/>
                    </div>


                    <h3 className="text-2xl font-semibold text-center">
                        SECTION C – RULES – ALL CODES
                    </h3>
                    <SectionC
                        selectedSet={selectedSet}
                        onScoreChange={(score) => handleSectionScore('sectionC', score)}
                        onSubmit={() => {
                            handleSubmit();
                        }}
                        submitted={submitted} isGridLayout={isGridLayout}/>

                    {selectedCode === 'Code 1' && (
                        <>
                            <h3 className="text-2xl font-semibold text-center">
                                SECTION D - MOTOR CYCLES ONLY
                            </h3>
                            <SectionD
                                selectedSet={selectedSet}
                                onScoreChange={(score) => handleSectionScore('sectionD', score)}
                                onSubmit={() => {
                                    handleSubmit();
                                }}
                                submitted={submitted} isGridLayout={isGridLayout}/>
                        </>
                    )}

                    {(selectedCode === 'Code 2' || selectedCode === 'Code 3') && (
                        <>
                            <h3 className="text-2xl font-semibold text-center">
                                SECTION E – LIGHT AND HEAVY VEHICLES ONLY
                            </h3>
                            <SectionE
                                selectedSet={selectedSet}
                                onScoreChange={(score) => handleSectionScore('sectionE', score)}
                                onSubmit={() => {
                                    handleSubmit();
                                }}
                                submitted={submitted}
                                isGridLayout={isGridLayout}/>
                        </>
                    )}

                    <Button
                        key="submit button"
                        color="primary"
                        variant="bordered"
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        className="transform transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-600 hover:text-white"
                    >
                        Submit
                    </Button>


                    {submitted && (
                        <div ref={scoreSummaryRef}>
                            <ScoreSummary
                                totalScore={totalScore}
                                percentage={percentage}
                                sectionScores={sectionScores}
                                sectionTotals={sectionTotals}
                                selectedCode={selectedCode}
                                getWeakestSectionMessage={getWeakestSectionMessage}
                            />
                        </div>

                    )}

                    {/* Timer overlay */}
                    {timerEnabled && timeLeft !== null &&
                        (
                            <div
                                className="fixed z-1000 top-[30px] md:top-[55px] right-0 m-4 bg-black text-white dark:bg-white dark:text-black p-2 rounded-md shadow-lg">
                                <p className="text-lg">
                                    Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
                                </p>
                            </div>
                        )
                    }

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
                                    setSectionScores({sectionA: 0, sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0}); // Reset section scores
                                    setTotalScore(0); // Reset total score to zero
                                    setIsButtonDisabled(false); // Re-enable the submit button
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
                        <Button
                            color="warning"
                            variant="light"
                            onClick={() => {
                                // Reset states
                                setSelectedSet(null); // Go back to code selection
                                setSubmitted(false); // Reset submission status
                                setSectionScores({sectionA: 0, sectionB: 0, sectionC: 0, sectionD: 0, sectionE: 0}); // Reset section scores
                                setTotalScore(0); // Reset total score to zero
                                setIsButtonDisabled(false); // Re-enable the submit button

                                // Close the modal
                                onClose();

                                // Close extra tests if they are shown
                                setShowExtraTests(false);
                            }}
                        >
                            Yes
                        </Button>
                        <Button onClick={onClose}>
                            No
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    );
}


