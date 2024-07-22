import React from "react";
import {Card, CardFooter, Image, Button} from "@nextui-org/react";
import {CardBody, CardHeader} from "@nextui-org/card";
import {Radio, RadioGroup} from "@nextui-org/radio";

export function Questioncard() {
    return (
        // grid-rows-3
        <div className="grid grid-flow-row-dense grid-cols-2  gap-4">
            <Card className="py-4 bg-white/5">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny font-semibold">52. A section of the road is marked with double unbroken
                        dividing
                        lines as in the diagram. When is
                        a vehicle allowed to cross the lines?
                    </p>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <Image
                        alt="Card background"
                        className="object-cover rounded-xl"
                        src="https://isqkzbwoiunnqsltbfpa.supabase.co/storage/v1/object/public/question_images/test%20card%201.png?t=2024-07-22T15%3A35%3A53.713Z"
                        width={270}
                    />
                </CardBody>
                <CardHeader>
                    <RadioGroup color="warning">
                        <Radio value="buenos-aires" description="The capital of Argentina">
                            A
                        </Radio>
                        <Radio value="canberra" description="The capital of Australia">
                            B
                        </Radio>
                        <Radio value="london" description="The capital of England">
                            C
                        </Radio>
                    </RadioGroup>
                </CardHeader>
            </Card>
        </div>
    );
}
