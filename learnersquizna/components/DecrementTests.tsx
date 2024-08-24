import { createClient } from '@/utils/supabase/client'; // Adjust the path as needed

const supabase = createClient();

export const decrementTestsLeft = async () => {
    try {
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
