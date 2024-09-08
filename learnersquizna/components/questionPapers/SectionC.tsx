import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from "@/components/Questioncard";
import { Image } from "@nextui-org/react";
import SectionImage from "@/components/questionPapers/SectionImage";

interface SectionCProps {
    selectedSet?: string;
    onScoreChange: (score: number) => void;
    submitted: boolean;
    onSubmit?: () => void;
    isGridLayout: boolean; // New prop for layout
}

interface AnswerOption {
    value: string;
    description: string;
}

export default function SectionC({ selectedSet, onScoreChange, submitted, onSubmit, isGridLayout }: SectionCProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const supabase = createClient();

    // Fetch posts and handle caching
    const fetchPosts = useCallback(async () => {
        const cacheKey = `sectionCData_${selectedSet}`;
        const cachedData = localStorage.getItem(cacheKey);

        let isDataNew = true;
        let latestDataVersion;

        if (cachedData) {
            const parsedData = JSON.parse(cachedData);

            // Fetch the latest updated_at timestamp from the database
            latestDataVersion = await supabase
                .from('question')
                .select('updated_at')
                .eq('section_text', 'SECTION C – RULES – ALL CODES')
                .eq('q_set', selectedSet)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            if (latestDataVersion.data && parsedData.updated_at === latestDataVersion.data.updated_at) {
                isDataNew = false;
            }

            if (!isDataNew) {
                setPosts(parsedData.posts);
                setShuffledOptionsMap(parsedData.shuffledOptionsMap);
                setIsLoading(false);
                return;
            }
        }

        // Fetch new data from Supabase if the data is new or cache is missing
        const { data: newData, error } = await supabase
            .from('question')
            .select('*')
            .order('q_number', { ascending: true })
            .eq('section_text', 'SECTION C – RULES – ALL CODES')
            .eq('q_set', selectedSet);

        if (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
            return;
        }

        const nonNullData = newData ?? [];
        setPosts(nonNullData);

        // Process and shuffle options
        const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = {};
        nonNullData.forEach((post) => {
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

        // Save the newly fetched data to local storage
        const dataToCache = {
            posts: nonNullData,
            shuffledOptionsMap: newShuffledOptionsMap,
            updated_at: latestDataVersion?.data?.updated_at || new Date().toISOString()
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

        setIsLoading(false);
    }, [selectedSet, supabase]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Handle answer change and score update
    const handleAnswerChange = useCallback((questionNumber: string, value: string): string => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = {
                ...prevAnswers,
                [questionNumber]: value
            };

            const score = posts.reduce((acc, post) => acc + (updatedAnswers[post.q_number] === "1" ? 1 : 0), 0);

            onScoreChange(score);

            return updatedAnswers;
        });

        return value;
    }, [posts, onScoreChange]);

    return isLoading ? (
        <p>Loading</p>
    ) : (
        <div className="z-0">
            <div className={`grid ${isGridLayout ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
                {posts.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    posts.map((post, index) => (
                        <Questioncard
                            key={post.q_number}
                            questionNumber={(index + 47).toString()}  // Start numbering from 47 and convert to string
                            questionText={post.question_text}
                            imageSrc={post.picture_link}
                            radioOptions={shuffledOptionsMap[post.q_number]?.map((option, idx) => ({
                                ...option,
                                label: ['A', 'B', 'C'][idx]
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
