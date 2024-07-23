"use client"
import React from "react";
import {Card, CardFooter, Image, Button} from "@nextui-org/react";
import {CardBody, CardHeader} from "@nextui-org/card";
import {Radio, RadioGroup} from "@nextui-org/radio";
import QuestionsGet from "@/components/QuestionsGet"

interface QuestionCardProps {
    questionNumber: string;
    questionText: string
    imageSrc:string
    radioDes1:string
    radioDes2: string
    radioDes3:string
}

export function Questioncard({ questionNumber,questionText, imageSrc, radioDes1,radioDes2,radioDes3 }: QuestionCardProps) {
    return (
        // grid-rows-3
        // <div className="grid grid-flow-row-dense grid-cols-2  gap-4">
            <Card className="py-4 bg-white/5">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny font-semibold">{questionNumber}". "{questionText}
                    </p>
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
                    <RadioGroup color="warning">
                        <Radio value="" description={radioDes1}>
                            A
                        </Radio>
                        <Radio value="" description={radioDes2}>
                            B
                        </Radio>
                        <Radio value="" description={radioDes3}>
                            C
                        </Radio>
                    </RadioGroup>
                </CardHeader>
            </Card>
        // </div>
    );
}
