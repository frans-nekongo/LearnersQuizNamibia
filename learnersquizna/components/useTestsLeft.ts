import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { decrementTestsLeft } from "@/components/DecrementTests"; // Adjust the path as needed

const supabase = createClient();

export function useTestsLeft() {
    const [testsLeft, setTestsLeft] = useState<number | null>(null);

    // Function to fetch the Tests_Left value
    const fetchTestsLeft = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchTestsLeft();
    }, [fetchTestsLeft]);

    const decrementTestsLeftLocally = useCallback(async () => {
        setTestsLeft(prev => {
            if (prev === null || prev <= 0) return prev;
            return prev - 1;
        });

        // Call function to update database
        await decrementTestsLeft();
    }, []);

    // Function to refresh the testsLeft value
    const refreshTestsLeft = useCallback(async () => {
        await fetchTestsLeft();
    }, [fetchTestsLeft]);

    return { testsLeft, decrementTestsLeftLocally, refreshTestsLeft };
}
