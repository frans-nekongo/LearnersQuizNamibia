import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust the path as needed

const supabase = createClient();

export function TestLeft() {
    const [testsLeft, setTestsLeft] = useState<number | null>(null);

    useEffect(() => {
        const fetchTestsLeft = async () => {
            // Get the current user's email
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData) {
                console.error("Error fetching user:", userError);
                return;
            }

            const email = userData.user?.email;

            if (!email) {
                console.error("No email found for the current user.");
                return;
            }

            // Fetch the Tests_Left value for the current user
            const { data, error } = await supabase
                .from('user')
                .select('Tests_Left')
                .eq('email_user', email)
                .single();

            if (error) {
                console.error("Error fetching tests left:", error);
                return;
            }

            setTestsLeft(data?.Tests_Left ?? null);
        };

        fetchTestsLeft();
    }, []);

    return (
        <div>
            <div>
                <p>{testsLeft !== null ? `${testsLeft} free tests left.` : 'Loading...'}</p>
            </div>
            {testsLeft === 0 && (
                <div className=" z-1000 text-sm mt-4 p-4 border border-red-500 rounded bg-red-100 text-red-700">
                    <p className="font-bold">Buy tests to continue.</p>
                    <p className="mt-2">Packages:</p>
                    <ul className="list-disc list-inside mt-2">
                        <li>5 more tests for N$30</li>
                        <li>8 more tests for N$50</li>
                        {/* Add more options as needed */}
                    </ul>
                    <p className="mt-2">
                        Pay2Cell eWalllet etc
                        <br/>
                        to 0817173244
                        <br/>
                        make your email the reference
                    </p>
                </div>
            )}
        </div>
    );
}
