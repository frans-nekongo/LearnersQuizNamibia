import {Tooltip} from "@nextui-org/react";
import {FaGithub, FaLinkedin, FaTwitter} from "react-icons/fa";

export function Footer() {
    return (
        <div className="container mx-auto flex flex-col items-center">

            {/*<p className="mt-2 text-xs md:text-sm text-gray-400">*/}
            {/*    Powered by Microsoft Word 2000 | © {new Date().getFullYear()}  All rights reserved.*/}
            {/*</p>*/}

            <p className="text-sm md:text-base">
                Developed and deployed by .
                <a
                    href="https://www.frans-nekongo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-red-800 hover:text-red-800 hover:underline transition duration-200"
                >
                    RXD
                </a>
            </p>

            <p className="mt-2 text-xs md:text-sm text-gray-400">
                Inspiré par{' '}
                <Tooltip
                    content="A great friend, we were supposed to get our learners, inspired me to make this because I struggle with reading and taking tests">
            <span className="font-bold text-blue-600 hover:text-blue-800 transition duration-200">
                NINO
            </span>
                </Tooltip>{' '}
                | Powered by Microsoft Word 2000 on Nokia 3320 | © {new Date().getFullYear()} RXD. All rights reserved.
            </p>


            {/*<div className="mt-3 flex space-x-4">*/}
            {/*    <a href="https://www.linkedin.com/in/frans-nekongo/" target="_blank" rel="noreferrer"*/}
            {/*       className="hover:opacity-75 transition duration-200">*/}
            {/*        <FaLinkedin className="w-5 h-5"/>*/}
            {/*    </a>*/}
            {/*    <a href="https://twitter.com/frans_nekongo" target="_blank" rel="noreferrer"*/}
            {/*       className="hover:opacity-75 transition duration-200">*/}
            {/*        <FaTwitter className="w-5 h-5"/>*/}
            {/*    </a>*/}
            {/*    <a href="https://github.com/fransnekongo" target="_blank" rel="noreferrer"*/}
            {/*       className="hover:opacity-75 transition duration-200">*/}
            {/*        <FaGithub className="w-5 h-5"/>*/}
            {/*    </a>*/}
            {/*</div>*/}


            {/*<div className="flex-1">*/}
            {/*    <h3 className="font-bold text-lg text-yellow-400">Affiliate Program</h3>*/}
            {/*    <p className="mt-2">*/}
            {/*        Interested in partnering with us? Check out our{" "}*/}
            {/*        <a href="/affiliate-program"*/}
            {/*           className="hover:text-yellow-300 hover:underline transition duration-200">*/}
            {/*            Affiliate Program*/}
            {/*        </a>*/}
            {/*        {" "}and start earning today!*/}
            {/*    </p>*/}
            {/*</div>*/}
        </div>
    );
}