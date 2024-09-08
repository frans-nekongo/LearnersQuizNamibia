import React from "react";
import { Card, CardFooter, Image } from "@nextui-org/react";
import { CardBody, CardHeader } from "@nextui-org/card";
import { Radio, RadioGroup } from "@nextui-org/radio";

interface RadioOption {
    value: string;
    description: string;
    label: string;
}

interface QuestionCardProps {
    questionNumber: string;
    questionText: string;
    imageSrc: string;
    radioOptions: RadioOption[];
    onAnswerChange: (value: string) => void;
    correctAnswer: string;
    submitted: boolean;
    selectedAnswer: string;
}

export function Questioncard({
    questionNumber,
    questionText,
    imageSrc,
    radioOptions,
    onAnswerChange,
    correctAnswer,
    submitted,
    selectedAnswer,
}: QuestionCardProps) {
    // Determine if the selected answer is incorrect
    const showCorrectAnswer = submitted && selectedAnswer !== correctAnswer;

    return (
        <Card className="py-4 bg-white/5 text-wrap">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny font-semibold text-wrap">{questionNumber}. {questionText}</p>
            </CardHeader>
            <div className="h-fit">
                <CardBody className="py-2">
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src={imageSrc}
                        width={270}
                    />
                </CardBody>
                <CardFooter className="flex flex-col items-start text-wrap">
                    <RadioGroup
                        color="warning"
                        name={`question-${questionNumber}`}
                        onValueChange={(value) => onAnswerChange(value)}
                        value={selectedAnswer}
                        isDisabled={submitted}// Disable the radio group if submitted is true
                    >
                        {radioOptions.map((option) => (
                            <Radio
                                key={option.value}
                                value={option.value}
                                description={option.description}
                                className="text-wrap break-words"
                                // disabled={submitted} // Disable the radio button if submitted is true
                            >
                                {option.label}
                            </Radio>
                        ))}
                    </RadioGroup>

                    {/* Answer Text (Shown if a wrong answer was selected and submitted) */}
                    {showCorrectAnswer && (
                        <div className="text-sm text-green-600">
                            Correct Answer: {correctAnswer}
                        </div>
                    )}
                </CardFooter>
            </div>
        </Card>
    );
}
