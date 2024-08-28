import {useEffect, useState} from 'react';
import {createClient} from '@/utils/supabase/client';
import {Questioncard} from "@/components/Questioncard";
import {Button} from '@nextui-org/react';

interface AnswerOption {
    value: string;
    description: string;
}

export function ExtraTests() {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const cacheKey = `extraTestsData`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setPosts(parsedData.posts);
                setShuffledOptionsMap(parsedData.shuffledOptionsMap);
                setIsLoading(false);
                return;
            }

            let {data: table_name, error} = await supabase
                .schema("public")
                .from('question')
                .select('*')
                .order('q_number', {ascending: true})
                .eq('section_text', 'SECTION B – SIGNS – ALL CODES'); // Fetch all questions with this section_text

            if (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                return;
            }

            const nonNullData = table_name ?? []; // Provide an empty array if data is null
            setPosts(nonNullData);

            // Map each option to its designated position
            const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = {};
            nonNullData.forEach((post) => {
                const options: AnswerOption[] = [
                    {value: "1", description: post.answer},
                    {value: "b", description: post.option_1},
                    {value: "c", description: post.option_2}
                ];

                // Assign options to A, B, C based on their values
                newShuffledOptionsMap[post.q_number] = ['A', 'B', 'C'].map((label, index) => {
                    const option = options[index];
                    if (option.description === label) {
                        return option; // Keep A, B, C in their places
                    } else if (option.description.match(/^[ABC]$/)) {
                        // If description matches A, B, or C, assign accordingly
                        return options.find(o => o.description === label) || option;
                    } else {
                        return option; // Keep non-A/B/C descriptions in their original place
                    }
                });
            });
            setShuffledOptionsMap(newShuffledOptionsMap);

            // Save data to local storage
            const dataToCache = {posts: nonNullData, shuffledOptionsMap: newShuffledOptionsMap};
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

            setIsLoading(false);
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        // Start the timer for 30 minutes (1800 seconds)
        const endTime = Date.now() + 90 * 60 * 1000;
        setTimeLeft(Math.max(Math.ceil((endTime - Date.now()) / 1000), 0));

        const id = setInterval(() => {
            const currentTime = Date.now();
            const timeRemaining = Math.max(Math.ceil((endTime - currentTime) / 1000), 0);
            setTimeLeft(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(id);
                handleSubmit(); // Auto-submit when time is up
            }
        }, 1000);

        setIntervalId(id);

        return () => clearInterval(id); // Clean up on component unmount
    }, []);

    const handleAnswerChange = (questionNumber: string, value: string): string => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = {
                ...prevAnswers,
                [questionNumber]: value
            };

            let score = 0;
            posts.forEach((post) => {
                if (updatedAnswers[post.q_number] === "1") {
                    score += 1;
                }
            });

            return updatedAnswers;
        });

        return value; // Return the value to satisfy the onAnswerChange type
    };

    const handleSubmit = () => {
        let score = 0;
        posts.forEach((post) => {
            if (answers[post.q_number] === "1") {
                score += 1;
            }
        });
        setTotalScore(score);
        setSubmitted(true);
        setIsButtonDisabled(true);

        // Clear the timer if it exists
        if (intervalId) {
            clearInterval(intervalId);
        }

        // Set the timer to zero
        setTimeLeft(0);
    };

    return isLoading ? (
        <p>Loading...</p>
    ) : (
        <div className="flex flex-col items-center space-y-6">
            <div
                className="flex justify-center items-center mt-5 bg-gray-800 border-4 border-yellow-400 rounded-lg p-4 shadow-lg text-yellow-400">
                {timeLeft !== null && (
                    <p className="text-2xl font-bold tracking-wide m-0">
                        Time Left: {`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {posts.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    posts.map((post) => (
                        <Questioncard
                            key={post.q_number}
                            questionNumber={post.q_number}
                            questionText={post.question_text}
                            imageSrc={post.picture_link}
                            radioOptions={shuffledOptionsMap[post.q_number].map((option, index) => ({
                                ...option,
                                label: ['A', 'B', 'C'][index] // Keep labels in A, B, C order
                            }))}
                            onAnswerChange={(value) => handleAnswerChange(post.q_number, value)}
                            correctAnswer={post.answer} // Pass correct answer
                            submitted={submitted} // Pass submitted state
                            selectedAnswer={answers[post.q_number]} // Pass selected answer
                        />
                    ))
                )}
            </div>

            {!submitted && (
                <div className="flex justify-center">
                    <Button
                        key="submit-button"
                        color="primary"
                        variant="bordered"
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                        className="px-6 py-2 text-lg font-semibold rounded-lg border-yellow-400 bg-gray-800 text-yellow-400 hover:bg-yellow-400 hover:text-gray-800"
                    >
                        Submit
                    </Button>
                </div>
            )}

            {submitted && (
                <div className="bg-yellow-400 border-4 border-gray-800 rounded-lg p-4 shadow-lg text-center">
                    <p className="text-2xl font-bold text-gray-800 m-0">
                        Your Score: <span className="text-red-600">{totalScore}</span> / {posts.length}
                    </p>
                </div>
            )}
        </div>
    );
}
