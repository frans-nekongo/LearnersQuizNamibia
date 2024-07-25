// 'use client';
import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
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
    onAnswerChange: (value: string) => string;
}

export function Questioncard({ questionNumber, questionText, imageSrc, radioOptions, onAnswerChange }: QuestionCardProps) {
    return (
        <Card className="py-4 bg-white/5">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny font-semibold">{questionNumber}. {questionText}</p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    src={imageSrc}
                    width={270}
                />
            </CardBody>
            <CardHeader>
                <RadioGroup color="warning" name={`question-${questionNumber}`} onValueChange={(value) => onAnswerChange(value)}>
                    {radioOptions.map((option) => (
                        <Radio key={option.value} value={option.value} description={option.description}>
                            {option.label}
                        </Radio>
                    ))}
                </RadioGroup>
            </CardHeader>
        </Card>
    );
}
