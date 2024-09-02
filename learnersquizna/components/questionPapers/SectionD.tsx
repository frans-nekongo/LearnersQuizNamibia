import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Questioncard } from '@/components/Questioncard';
import SectionImage2 from '@/components/questionPapers/SectionImage2';

interface SectionDProps {
    selectedSet?: string;
    onScoreChange: (score: number) => void;
    submitted: boolean;
    onSubmit?: () => void;
}

interface AnswerOption {
    value: string;
    description: string;
}

export default function SectionD({ selectedSet, onScoreChange, submitted, onSubmit }: SectionDProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const cacheKey = `sectionDData_${selectedSet}`;
            const cachedData = localStorage.getItem(cacheKey);
            let latestDataVersion;

            // Fetch the latest updated_at timestamp from the database
            const { data: versionData } = await supabase
                .from('question')
                .select('updated_at')
                .eq('section_text', 'SECTION E – LIGHT AND HEAVY VEHICLES ONLY')
                .eq('q_set', selectedSet)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();

            latestDataVersion = versionData?.updated_at;

            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                if (latestDataVersion && parsedData.updated_at === latestDataVersion) {
                    setPosts(parsedData.posts);
                    setIsLoading(false);
                    return;
                }
            }

            // Fetch new data from Supabase if the data is new or cache is missing
            const { data: tableName, error } = await supabase
                .from('question')
                .select('*')
                .order('q_number', { ascending: true })
                .eq('section_text', 'SECTION D - MOTOR CYCLES ONLY')
                .eq('q_set', selectedSet);

            if (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                return;
            }

            const nonNullData = tableName ?? [];
            setPosts(nonNullData);

            // Save the newly fetched data to local storage
            localStorage.setItem(cacheKey, JSON.stringify({
                posts: nonNullData,
                updated_at: latestDataVersion || new Date().toISOString(),
            }));

            setIsLoading(false);
        };

        fetchPosts();
    }, [selectedSet, supabase]);

    const shuffledOptionsMap = useMemo(() => {
        const map: { [key: string]: AnswerOption[] } = {};
        posts.forEach((post) => {
            const options: AnswerOption[] = [
                { value: "1", description: post.answer },
                { value: "b", description: post.option_1 },
                { value: "c", description: post.option_2 }
            ];

            map[post.q_number] = ['A', 'B', 'C'].map((label, index) => {
                const option = options[index];
                if (option.description === label) {
                    return option;
                }
                return options.find(o => o.description === label) || option;
            });
        });
        return map;
    }, [posts]);

    const handleAnswerChange = (questionNumber: string, value: string): string => {
        setAnswers(prevAnswers => {
            const updatedAnswers = {
                ...prevAnswers,
                [questionNumber]: value
            };

            const score = posts.reduce((acc, post) => (
                updatedAnswers[post.q_number] === "1" ? acc + 1 : acc
            ), 0);

            onScoreChange(score);
            return updatedAnswers;
        });

        return value;
    };

    if (isLoading) {
        return <p>Loading</p>;
    }

    return (
        <div>
            <div className="z-0 flex flex-col p-4 items-center justify-center">
                <SectionImage2 selectedSet={selectedSet ?? 'A'} />
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
