import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from '@/components/Questioncard';

interface SectionAProps {
    selectedSet?: string;
    onScoreChange: (score: number) => void;
    submitted: boolean;
    onSubmit?: () => void;
}

interface AnswerOption {
    value: string;
    description: string;
}

const cacheKeyPrefix = 'sectionAData_';

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

export default function SectionA({ selectedSet, onScoreChange, submitted, onSubmit }: SectionAProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
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

            const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = {};
            nonNullData.forEach((post: { answer: any; option_1: any; option_2: any; q_number: string | number; }) => {
                const options: AnswerOption[] = [
                    { value: "1", description: post.answer },
                    { value: "b", description: post.option_1 },
                    { value: "c", description: post.option_2 }
                ];

                newShuffledOptionsMap[post.q_number] = ['A', 'B', 'C'].map((label, index) => {
                    const option = options[index];
                    return option.description === label ? option : options.find(o => o.description === label) || option;
                });
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

    const handleAnswerChange = useCallback((questionNumber: string, value: string) => {
        setAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers, [questionNumber]: value };

            const score = posts.reduce((acc, post) => (
                updatedAnswers[post.q_number] === "1" ? acc + 1 : acc
            ), 0);

            onScoreChange(score);
            return updatedAnswers;
        });
    }, [posts, onScoreChange]);

    return isLoading ? (
        <p>Loading</p>
    ) : (
        <div>
            <div className="grid grid-flow-row-dense grid-cols-2 gap-4">
                {posts.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    posts.map((post) => (
                        <Questioncard
                            key={post.q_number}
                            questionNumber={post.q_number}
                            questionText={post.question_text}
                            imageSrc={post.picture_link}
                            radioOptions={shuffledOptionsMap[post.q_number]?.map((option, index) => ({
                                ...option,
                                label: ['A', 'B', 'C'][index]
                            })) || []}
                            onAnswerChange={(value) => handleAnswerChange(post.q_number, value)}
                            correctAnswer={post.answer}
                            submitted={submitted}
                            selectedAnswer={answers[post.q_number]}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
