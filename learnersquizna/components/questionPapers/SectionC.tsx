import {useEffect, useState} from 'react';
import {createClient} from '@/utils/supabase/client';
import {Questioncard} from "@/components/Questioncard";
import {Image} from "@nextui-org/react";
import SectionImage from "@/components/questionPapers/SectionImage";

interface SectionCProps {
    selectedSet?: string,
    onScoreChange: (score: number) => void,
    submitted: boolean,
    onSubmit?: () => void
}

interface AnswerOption {
    value: string;
    description: string;
}

export default function SectionC({selectedSet, onScoreChange, submitted, onSubmit}: SectionCProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const cacheKey = `sectionCData_${selectedSet}`;
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
                .eq('section_text', 'SECTION C – RULES – ALL CODES')
                .eq('q_set', selectedSet);

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

                // Assign options to A, B, C based on their values, unless it's not "A", "B", or "C"
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
    }, [selectedSet]);

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

            onScoreChange(score);

            return updatedAnswers;
        });

        return value; // Return the value to satisfy the onAnswerChange type
    };

    return isLoading ? (
        <p>Loading</p>
    ) : (
        <div>
            {/*<div className="flex flex-col p-4 items-center justify-center">*/}
            {/*    Section Picture Here*/}
            {/*    <SectionImage selectedSet={selectedSet ?? 'A'}/>*/}
            {/*</div>*/}

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
        </div>
    );
}
