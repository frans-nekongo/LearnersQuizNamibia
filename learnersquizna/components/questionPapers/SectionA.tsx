import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from '@/components/Questioncard';

interface SectionAProps {
    selectedSet?: string;
    onScoreChange: (score: number) => void;
    submitted: boolean;
    onSubmit?: () => void;
    isGridLayout: boolean;
}

interface AnswerOption {
    value: string;
    description: string;
}

const cacheKeyPrefix = 'sectionAData_';

// Function to shuffle array elements
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchLatestDataVersion(supabase: any, selectedSet?: string) {
    const { data, error } = await supabase
        .from('question')
        .select('updated_at')
        .eq('section_text', 'SECTION A: PRACTICE QUESTIONS')
        .eq('q_set', selectedSet)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching latest data version:', error);
        return null;
    }

    return data?.updated_at || null;
}

async function fetchDataFromSupabase(supabase: any, selectedSet?: string) {
    const { data, error } = await supabase
        .from('question')
        .select('*')
        .order('q_number', { ascending: true })
        .eq('section_text', 'SECTION A: PRACTICE QUESTIONS')
        .eq('q_set', selectedSet);

    if (error) {
        console.error('Error fetching data:', error);
        return [];
    }

    return data || [];
}

export default function SectionA({ selectedSet, onScoreChange, submitted, onSubmit, isGridLayout }: SectionAProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: number]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);

            const cacheKey = `${cacheKeyPrefix}${selectedSet}`;
            const cachedData = localStorage.getItem(cacheKey);

            let isDataNew = true;
            let latestDataVersion;

            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                latestDataVersion = await fetchLatestDataVersion(supabase, selectedSet);

                if (latestDataVersion && parsedData.updated_at === latestDataVersion) {
                    isDataNew = false;
                    setPosts(parsedData.posts);
                    setShuffledOptionsMap(parsedData.shuffledOptionsMap);
                    setIsLoading(false);
                    return;
                }
            }

            const nonNullData = await fetchDataFromSupabase(supabase, selectedSet);
            setPosts(nonNullData);

            const newShuffledOptionsMap: { [key: number]: AnswerOption[] } = {};
            nonNullData.forEach((post: { answer: any; option_1: any; option_2: any; q_number: string | number; }, index: number) => {
                const options: AnswerOption[] = [
                    { value: "1", description: post.answer },
                    { value: "2", description: post.option_1 },
                    { value: "3", description: post.option_2 }
                ];

                // Shuffle the options array
                const shuffledOptions = shuffleArray([...options]);

                newShuffledOptionsMap[index + 1] = shuffledOptions;
            });

            setShuffledOptionsMap(newShuffledOptionsMap);

            const dataToCache = {
                posts: nonNullData,
                shuffledOptionsMap: newShuffledOptionsMap,
                updated_at: latestDataVersion || new Date().toISOString()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

            setIsLoading(false);
        };

        fetchPosts();
    }, [selectedSet, supabase]);

    const handleAnswerChange = useCallback((questionNumber: number, value: string) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers, [questionNumber]: value };

            const score = posts.reduce((acc, post) => (
                updatedAnswers[posts.indexOf(post) + 1] === "1" ? acc + 1 : acc
            ), 0);

            onScoreChange(score);
            return updatedAnswers;
        });
    }, [posts, onScoreChange]);

    return isLoading ? (
        <p>Loading</p>
    ) : (
        <div>
            {/* Conditional layout rendering based on the isGridLayout prop */}
            <div className={`grid ${isGridLayout ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
                {posts.length === 0 ? (
                    <p>No data available</p>
                ) :
                    (
                    posts.map((post, index) => (
                        <Questioncard
                            key={index + 1}
                            questionNumber={(index + 1).toString()}
                            questionText={post.question_text}
                            imageSrc={post.picture_link}
                            radioOptions={shuffledOptionsMap[index + 1]?.map((option, optionIndex) => ({
                                ...option,
                                label: ['A', 'B', 'C'][optionIndex]
                            })) || []}
                            onAnswerChange={(value) => handleAnswerChange(index + 1, value)}
                            correctAnswer={post.answer}
                            submitted={submitted}
                            selectedAnswer={answers[index + 1]}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
