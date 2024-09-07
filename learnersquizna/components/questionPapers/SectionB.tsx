import {useEffect, useState, useMemo, useCallback} from 'react';
import {createClient} from '@/utils/supabase/client';
import {Questioncard} from "@/components/Questioncard";

interface SectionBProps {
    selectedSet?: string;
    onScoreChange: (score: number) => void;
    submitted: boolean;
    onSubmit?: () => void;
}

interface AnswerOption {
    value: string;
    description: string;
}

interface Post {
    q_number: string;
    question_text: string;
    picture_link: string;
    answer: string;
    option_1: string;
    option_2: string;
}

const fetchCachedData = async (cacheKey: string, supabase: any, selectedSet?: string) => {
    const cachedData = localStorage.getItem(cacheKey);
    let isDataNew = true;
    let latestDataVersion;

    if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        latestDataVersion = await supabase
            .from('question')
            .select('updated_at')
            .eq('section_text', 'SECTION B – SIGNS – ALL CODES')
            .eq('q_set', selectedSet)
            .order('updated_at', {ascending: false})
            .limit(1)
            .single();

        if (latestDataVersion.data && parsedData.updated_at === latestDataVersion.data.updated_at) {
            isDataNew = false;
            return {isDataNew, data: parsedData};
        }
    }

    return {isDataNew, data: null};
};

const SectionB = ({selectedSet, onScoreChange, submitted, onSubmit}: SectionBProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [shuffledOptionsMap, setShuffledOptionsMap] = useState<{ [key: string]: AnswerOption[] }>({});
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const cacheKey = `sectionBData_${selectedSet}`;
            const {isDataNew, data: cachedData} = await fetchCachedData(cacheKey, supabase, selectedSet);

            if (!isDataNew && cachedData) {
                setPosts(cachedData.posts);
                setShuffledOptionsMap(cachedData.shuffledOptionsMap);
                setIsLoading(false);
                return;
            }

            const {data: tableName, error} = await supabase
                .from('question')
                .select('*')
                .order('q_number', {ascending: true})
                .eq('section_text', 'SECTION B – SIGNS – ALL CODES')
                .eq('q_set', selectedSet);

            if (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                return;
            }

            const nonNullData = tableName ?? [];
            setPosts(nonNullData);

            const newShuffledOptionsMap: { [key: string]: AnswerOption[] } = {};
            nonNullData.forEach((post) => {
                const options: AnswerOption[] = [
                    {value: "1", description: post.answer},
                    {value: "b", description: post.option_1},
                    {value: "c", description: post.option_2}
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

            const dataToCache = {
                posts: nonNullData,
                shuffledOptionsMap: newShuffledOptionsMap,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

            setIsLoading(false);
        };

        fetchPosts();
    }, [selectedSet, supabase]);

    const handleAnswerChange = useCallback((questionNumber: string, value: string): string => {
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

        return value;
    }, [posts, onScoreChange]);

    const renderedPosts = useMemo(() => (
        posts.length === 0 ? (
            <p>No data available</p>
        ) : (
            posts.map((post, index) => (
                <Questioncard
                    key={post.q_number}
                    questionNumber={(index + 4).toString()}  // Convert the number to a string
                    questionText={post.question_text}
                    imageSrc={post.picture_link}
                    radioOptions={shuffledOptionsMap[post.q_number].map((option, idx) => ({
                        ...option,
                        label: ['A', 'B', 'C'][idx]
                    }))}
                    onAnswerChange={(value) => handleAnswerChange(post.q_number, value)}
                    correctAnswer={post.answer}
                    submitted={submitted}
                    selectedAnswer={answers[post.q_number]}
                />
            ))
        )
    ), [posts, shuffledOptionsMap, answers, handleAnswerChange, submitted]);


    return isLoading ? (
        <p>Loading</p>
    ) : (
        <div>
            <div className="grid grid-flow-row-dense grid-cols-2 gap-4">
                {renderedPosts}
            </div>
        </div>
    );
};

export default SectionB;
