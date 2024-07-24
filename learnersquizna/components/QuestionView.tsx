"use client"
import {useState} from 'react';
import SectionB from "@/components/questionPapers/SectionB";
import SectionC from "@/components/questionPapers/SectionC";
import SectionD from "@/components/questionPapers/SectionD";
import SectionE from './questionPapers/SectionE';
import {Button} from "@nextui-org/react";

export function QuestionView() {
    const [selectedSet, setSelectedSet] = useState(null); // Initialize with null to indicate no selection

    return (
        <>
            {!selectedSet && ( // Only render buttons if no selection has been made
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
            )}

            {selectedSet && ( // Only render sections if a selection has been made
                <>
                    <h3 className="text-2xl font-semibold text-center">
                        SECTION B – SIGNS – ALL CODES
                    </h3>
                    <SectionB selectedSet={selectedSet}/>

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
                </>
            )}
        </>
    );
}
