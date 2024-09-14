import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from "@/components/Questioncard";
import SectionImage from "@/components/questionPapers/SectionImage";

interface SectionEProps {
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

interface Question {
    q_number: string;
    question_text: string;
    picture_link: string;
    answer: string;
    option_1: string;
    option_2: string;
}

export default function SectionE({ selectedSet, onScoreChange, submitted, onSubmit, isGridLayout }: SectionEProps) {
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

            // Map to hold the shuffled options
            const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = nonNullData.reduce((acc, post, index) => {
                // Create the options array with the correct answer always having value "1"
                const options: AnswerOption[] = [
                    { value: "1", description: post.answer },   // Correct answer
                    { value: "b", description: post.option_1 }, // Option 1
                    { value: "c", description: post.option_2 }  // Option 2
                ];

                // Create a label map for ensuring each label gets a unique option
                const labels = ['A', 'B', 'C'];
                const optionMap = new Map<string, AnswerOption>();
                options.forEach((option, idx) => {
                    const label = labels[idx];
                    optionMap.set(label, option);
                });

                // Ensure all labels are included
                const finalOptions: AnswerOption[] = labels.map((label) => optionMap.get(label) || { value: '', description: '' });

                // Shuffle options (optional)
                const shuffledOptions = finalOptions.sort(() => Math.random() - 0.5);

                // Use the new question number starting from 71
                const newQuestionNumber = (71 + index).toString();

                acc[newQuestionNumber] = shuffledOptions.map((option, idx) => ({
                    ...option,
                    label: labels[idx]  // Assign labels A, B, C in order after shuffling
                }));

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
            const score = posts.reduce((acc, post, index) => {
                const newQuestionNumber = (71 + index).toString();
                return acc + (updatedAnswers[newQuestionNumber] === "1" ? 1 : 0);
            }, 0);
            onScoreChange(score);
            return updatedAnswers;
        });

        return value;
    };

    return isLoading ? (
        <p>Loading...</p>
    ) : (
        <div className="z-0">
            <div className="z-0 flex flex-col p-4 items-center justify-center">
                <SectionImage selectedSet={selectedSet ?? 'A'} />
            </div>

            <div className={`grid ${isGridLayout ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
                {posts.length === 0 ? (
                    <p>No data available</p>
                ) : (
                    posts.map((post, index) => {
                        const newQuestionNumber = (71 + index).toString(); // Calculate new question number
                        return (
                            <Questioncard
                                key={newQuestionNumber}
                                questionNumber={newQuestionNumber} // Use new question number
                                questionText={post.question_text}
                                imageSrc={post.picture_link}
                                radioOptions={shuffledOptionsMap[newQuestionNumber]?.map((option, idx) => ({
                                    ...option,
                                    label: ['A', 'B', 'C'][idx]
                                }))}
                                onAnswerChange={(value) => handleAnswerChange(newQuestionNumber, value)}
                                correctAnswer={post.answer}
                                submitted={submitted}
                                selectedAnswer={answers[newQuestionNumber]}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
}
