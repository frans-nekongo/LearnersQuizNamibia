import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from "@/components/Questioncard";
import SectionImage from "@/components/questionPapers/SectionImage";

interface SectionEProps {
    selectedSet?: string;
    onScoreChange: (score: number) => void;
    submitted: boolean;
    onSubmit?: () => void;
}

interface AnswerOption {
    value: string;
    description: string;
}

interface Question {
    q_number: string;
    question_text: string;
    picture_link: string;
    answer: string;
    option_1: string;
    option_2: string;
}

export default function SectionE({ selectedSet, onScoreChange, submitted, onSubmit }: SectionEProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Question[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const cacheKey = `sectionEData_${selectedSet}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                const { data: latestDataVersion, error: versionError } = await supabase
                    .from('question')
                    .select('updated_at')
                    .eq('section_text', 'SECTION E – LIGHT AND HEAVY VEHICLES ONLY')
                    .eq('q_set', selectedSet)
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (versionError || !latestDataVersion || parsedData.updated_at !== latestDataVersion.updated_at) {
                    // Data is outdated or error fetching version, fetch new data
                    await fetchAndCacheData(cacheKey);
                } else {
                    // Use cached data
                    setPosts(parsedData.posts);
                    setShuffledOptionsMap(parsedData.shuffledOptionsMap);
                    setIsLoading(false);
                }
            } else {
                // Cache not found, fetch new data
                await fetchAndCacheData(cacheKey);
            }
        };

        const fetchAndCacheData = async (cacheKey: string) => {
            const { data, error } = await supabase
                .from('question')
                .select('*')
                .order('q_number', { ascending: true })
                .eq('section_text', 'SECTION E – LIGHT AND HEAVY VEHICLES ONLY')
                .eq('q_set', selectedSet);

            if (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                return;
            }

            const nonNullData = data ?? [];
            setPosts(nonNullData);

            const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = nonNullData.reduce((acc, post) => {
                const options: AnswerOption[] = [
                    { value: "1", description: post.answer },
                    { value: "b", description: post.option_1 },
                    { value: "c", description: post.option_2 }
                ];

                acc[post.q_number] = ['A', 'B', 'C'].map((label, index) => {
                    const option = options[index];
                    return option.description === label
                        ? option
                        : options.find(o => o.description === label) || option;
                });

                return acc;
            }, {} as { [key: string]: AnswerOption[] });

            setShuffledOptionsMap(newShuffledOptionsMap);

            // Save the fetched data to local storage
            const dataToCache = {
                posts: nonNullData,
                shuffledOptionsMap: newShuffledOptionsMap,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

            setIsLoading(false);
        };

        fetchPosts();
    }, [selectedSet]);

    const handleAnswerChange = (questionNumber: string, value: string): string => {
        setAnswers(prevAnswers => {
            const updatedAnswers = { ...prevAnswers, [questionNumber]: value };
            const score = posts.reduce((acc, post) => acc + (updatedAnswers[post.q_number] === "1" ? 1 : 0), 0);
            onScoreChange(score);
            return updatedAnswers;
        });

        return value;
    };

    return isLoading ? (
        <p>Loading...</p>
    ) : (
        <div>
            <div className="z-0 flex flex-col p-4 items-center justify-center">
                <SectionImage selectedSet={selectedSet ?? 'A'} />
            </div>

            <div className="grid grid-flow-row-dense grid-cols-2 gap-4">
                {posts.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    posts.map(post => (
                        <Questioncard
                            key={post.q_number}
                            questionNumber={post.q_number}
                            questionText={post.question_text}
                            imageSrc={post.picture_link}
                            radioOptions={shuffledOptionsMap[post.q_number].map((option, index) => ({
                                ...option,
                                label: ['A', 'B', 'C'][index]
                            }))}
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
