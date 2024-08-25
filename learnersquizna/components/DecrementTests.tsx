"use client";

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Adjust the path as needed

const supabase = createClient();

const retryFailedDecrements = async () => {
    const failedDecrements = JSON.parse(localStorage.getItem('failedDecrements') || '[]');

    if (failedDecrements.length === 0) {
        console.log("No failed decrements to retry.");
        return;
    }

    console.log("Retrying failed decrements...");

    for (const decrement of failedDecrements) {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData) {
                console.error("Error fetching user:", userError);
                continue;
            }

            const email = userData.user?.email;

            if (!email) {
                console.error("No email found for the current user.");
                continue;
            }

            // Fetch the current number of tests left
            const { data: userDataFromDb, error: fetchError } = await supabase
                .from('user')
                .select('Tests_Left')
                .eq('email_user', email)
                .single();

            if (fetchError) {
                console.error("Error fetching tests left:", fetchError);
                continue;
            }

            const testsLeft = userDataFromDb?.Tests_Left;

            if (testsLeft === null || testsLeft <= 0) {
                console.log("Tests left is zero or less. Not updating.");
                continue;
            }

            // Decrement the number of tests left
            const { error: updateError } = await supabase
                .from('user')
                .update({ Tests_Left: testsLeft - 1 })
                .eq('email_user', email);

            if (updateError) {
                console.error("Error updating tests left:", updateError);
                continue;
            }

            console.log("Successfully retried decrement.");
        } catch (error) {
            console.error("Unexpected error during retry:", error);
        }
    }

    localStorage.setItem('failedDecrements', JSON.stringify([])); // Clear failed decrements after retry
};

export const decrementTestsLeft = async () => {
    try {
        // Get the current user's email
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData) {
            console.error("Error fetching user:", userError);
            // Save failed decrement to localStorage
            const failedDecrements = JSON.parse(localStorage.getItem('failedDecrements') || '[]');
            failedDecrements.push({ timestamp: Date.now(), testsLeft: 0 }); // Adjust as needed
            localStorage.setItem('failedDecrements', JSON.stringify(failedDecrements));
            return;
        }

        const email = userData.user?.email;

        if (!email) {
            console.error("No email found for the current user.");
            return;
        }

        // Fetch the current number of tests left
        const { data: userDataFromDb, error: fetchError } = await supabase
            .from('user')
            .select('Tests_Left')
            .eq('email_user', email)
            .single();

        if (fetchError) {
            console.error("Error fetching tests left:", fetchError);
            return;
        }

        const testsLeft = userDataFromDb?.Tests_Left;

        if (testsLeft === null || testsLeft <= 0) {
            console.error("No tests left or already at zero.");
            return;
        }

        // Decrement the number of tests left
        const { error: updateError } = await supabase
            .from('user')
            .update({ Tests_Left: testsLeft - 1 })
            .eq('email_user', email);

        if (updateError) {
            console.error("Error updating tests left:", updateError);
            return;
        }

        console.log("Tests left decremented by 1.");
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};

export const useSyncDecrementOnLoad = () => {
    useEffect(() => {
        const handleOnline = () => {
            console.log("Back online. Attempting to retry failed decrements...");
            retryFailedDecrements();
        };

        window.addEventListener('online', handleOnline);

        // Retry failed decrements on component mount
        console.log("Synchronizing failed decrements on load...");
        retryFailedDecrements();

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);
};
