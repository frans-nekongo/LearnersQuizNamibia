// TestInfo.tsx
"use client"
import { useTestsLeft } from '@/components/useTestsLeft'; // Import the custom hook

export function TestInfo() {
    const { testsLeft, decrementTestsLeftLocally } = useTestsLeft(); // Use the hook to get testsLeft and the function

    return (
        <div className="fixed z-1000 top-[30px] md:top-[55px] left-[0px] m-4 bg-default text-black dark:bg-white dark:text-black p-2 rounded-md shadow-lg">
            <div>
                <div>
                    <p>{testsLeft !== null ? `${testsLeft} free tests left.` : 'Loading...'}</p>
                </div>
                {testsLeft === 0 && (
                    <div className="z-1000 text-sm mt-4 p-4 border border-red-500 rounded bg-red-100 text-red-700">
                        <p className="font-bold">Buy tests to continue.</p>
                        <p className="mt-2">Packages:</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>5 more tests for N$30</li>
                            <li>8 more tests for N$50</li>
                            {/* Add more options as needed */}
                        </ul>
                        <p className="mt-2">
                            Pay2Cell eWalllet etc
                            <br />
                            to 0817173244
                            <br />
                            make your email the reference
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
