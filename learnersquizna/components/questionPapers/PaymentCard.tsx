import React from 'react';
import {Card, CardHeader, CardBody, Divider} from "@nextui-org/react";

interface PaymentCardProps {
    title: string;
    steps: string[];
}

const PaymentCard: React.FC<PaymentCardProps> = ({title, steps}) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <h3 className="text-2xl font-semibold">{title}</h3>
            </CardHeader>
            <Divider/>
            <CardBody>
                <p>To pay using {title}, follow these steps:</p>
                <ul className="list-disc pl-5 mb-4">
                    {steps.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ul>
            </CardBody>
        </Card>
    );
};

export default PaymentCard;
