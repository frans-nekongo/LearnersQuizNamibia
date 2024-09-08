import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from "@/components/Questioncard";
import { Button } from '@nextui-org/react';
import { useTestsLeft } from "@/components/useTestsLeft";

interface AnswerOption {
    value: string;
    description: string;
}

export function ExtraTests() {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const supabase = createClient();

    useEffect(() => {
    const fetchPosts = async () => {
        const cacheKey = 'extraTestsData';
        const cacheExpiryKey = 'extraTestsDataExpiry';
        const cacheDuration = 1000 * 60 * 60; // 1 hour cache duration

        const cachedData = localStorage.getItem(cacheKey);
        const cachedExpiry = localStorage.getItem(cacheExpiryKey);

        // Check if cache has expired or does not exist
        const isCacheExpired = !cachedExpiry || (Date.now() - parseInt(cachedExpiry, 10)) > cacheDuration;

        if (cachedData && !isCacheExpired) {
            const parsedData = JSON.parse(cachedData);
            setPosts(parsedData.posts);
            setShuffledOptionsMap(parsedData.shuffledOptionsMap);
            setIsLoading(false);
        } else {
            let { data: table_name, error } = await supabase
                .schema("public")
                .from('question')
                .select('*')
                .order('q_number', { ascending: true })
                .eq('section_text', 'SECTION B – SIGNS – ALL CODES');

            if (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                return;
            }

            const nonNullData = table_name ?? [];
            setPosts(nonNullData);

            const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = {};
            nonNullData.forEach((post) => {
                const options: AnswerOption[] = [
                    { value: "1", description: post.answer },
                    { value: "b", description: post.option_1 },
                    { value: "c", description: post.option_2 }
                ];

                newShuffledOptionsMap[post.q_number] = ['A', 'B', 'C'].map((label, index) => {
                    const option = options[index];
                    if (option.description === label) {
                        return option;
                    } else if (option.description.match(/^[ABC]$/)) {
                        return options.find(o => o.description === label) || option;
                    } else {
                        return option;
                    }
                });
            });
            setShuffledOptionsMap(newShuffledOptionsMap);

            // Cache the new data along with a timestamp to track cache duration
            const dataToCache = { posts: nonNullData, shuffledOptionsMap: newShuffledOptionsMap };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
            localStorage.setItem(cacheExpiryKey, Date.now().toString());

            setIsLoading(false);
        }
    };

    fetchPosts();
}, []);


    useEffect(() => {
        const endTime = Date.now() + 80 * 60 * 1000;
        setTimeLeft(Math.max(Math.ceil((endTime - Date.now()) / 1000), 0));

        const id = setInterval(() => {
            const currentTime = Date.now();
            const timeRemaining = Math.max(Math.ceil((endTime - currentTime) / 1000), 0);
            setTimeLeft(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(id);
                handleSubmit();
            }
        }, 1000);

        setIntervalId(id);

        return () => clearInterval(id);
    }, []);

    const handleAnswerChange = (index: number, value: string): string => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = {
                ...prevAnswers,
                [index]: value
            };

            let score = 0;
            posts.forEach((post, i) => {
                if (updatedAnswers[i] === "1") {
                    score += 1;
                }
            });

            return updatedAnswers;
        });

        return value;
    };

    const { testsLeft, decrementTestsLeftLocally } = useTestsLeft();

    const handleSubmit = async () => {
        let score = 0;
        posts.forEach((post, i) => {
            if (answers[i] === "1") {
                score += 1;
            }
        });

        await decrementTestsLeftLocally();

        setTotalScore(score);
        setSubmitted(true);
        setIsButtonDisabled(true);

        if (intervalId) {
            clearInterval(intervalId);
        }

        setTimeLeft(0);
    };

    return isLoading ? (
        <p>Loading...</p>
    ) : (
        <div className="flex flex-col items-center space-y-6">
            <div
                className="z-50 sticky top-0 flex justify-center items-center mt-5 bg-gray-800 border-4 border-yellow-400 rounded-lg p-4 shadow-lg text-yellow-400">
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
                    posts.map((post, index) => (
                        <Questioncard
                            key={index} // Use index for key
                            questionNumber={(index + 1).toString()} // Auto-increment starting from 1, converted to string
                            questionText={post.question_text}
                            imageSrc={post.picture_link}
                            radioOptions={shuffledOptionsMap[post.q_number]?.map((option, optIndex) => ({
                                ...option,
                                label: ['A', 'B', 'C'][optIndex]
                            })) || []}
                            onAnswerChange={(value) => handleAnswerChange(index, value)}
                            correctAnswer={post.answer}
                            submitted={submitted}
                            selectedAnswer={answers[index]}
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
