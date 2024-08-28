import React from 'react';
import {Card, CardHeader, CardBody, CardFooter, Divider} from '@nextui-org/react';
import {FaInfoCircle, FaStar} from "react-icons/fa";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
}

const PricingCard: React.FC<PricingCardProps> = ({title, price, description}) => {
    return (
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg  shadow-lg rounded-xl hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardHeader className="flex flex-col items-center text-center p-6">
                <FaStar className="text-4xl mb-2" /> {/* Icon for the card header */}
                <h3 className="text-2xl font-extrabold mb-2">{title}</h3>
                <p className="text-3xl font-bold mb-4">{price}</p>
            </CardHeader>
            <Divider className="border-white/40"/>
            <CardBody className="p-6 flex flex-col items-center">
                <FaInfoCircle className="text-3xl mb-4" /> {/* Icon for the card body */}
                <p className="text-lg text-center">{description}</p>
            </CardBody>
        </Card>
    );
};

export default PricingCard;
