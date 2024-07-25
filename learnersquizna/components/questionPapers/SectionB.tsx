import {useEffect, useState} from 'react'
import {createClient} from '@/utils/supabase/client'
import {Questioncard} from "@/components/Questioncard";
import {AnimateLoading} from "@/components/AnimateLoading";
import {access} from "node:fs";
import {any} from "prop-types";

interface SectionBProps {/*change this when section move*/
    selectedSet?: string
    onScoreChange: (score: number) => null;
}

interface answer {
    answer: string
}

function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function SectionB({selectedSet, onScoreChange}: SectionBProps) {/*change this when section move*/
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<any>([])
    const supabase = createClient()

    const [answers
        , setAnswers] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            let {data: table_name, error} = await supabase
                .schema("public")
                .from('question')
                .select('*')
                .order('q_number', {ascending: true})
                .eq('section_text', 'SECTION B – SIGNS – ALL CODES')//change this wehn section move
                .eq('q_set', selectedSet)

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setPosts(table_name);
            }
            setIsLoading(false);
        }

        fetchPosts()
    }, [selectedSet]);

    const handleAnswerChange = (questionNumber: string, value: string): any => {
        setAnswers((prevAnswers) => {
            const updatedAnswers: any = {
                ...prevAnswers,
                [questionNumber]: value
            };

            // Calculate score whenever answers change
            let score = 0;
            posts.forEach((post: { q_number: string | number; }) => {
                if (updatedAnswers[post.q_number] === "1") {
                    score += 1;
                }
            });

            // Pass the score to the parent component
            onScoreChange(score);

            return updatedAnswers;
        });
    };

    const calculateScore = () => {
        let score = 0;
        posts.forEach((post: { q_number: string | number; }) => {
            if (answers[post.q_number] === "1") {
                score += 1;
            }
        });
        return score;
    };

    return isLoading ? (
        <p>Loading</p>
        // <AnimateLoading/>
    ) : (
        <div className="grid grid-flow-row-dense grid-cols-2 gap-4">
            {posts.length === 0 ? (
                <p>No data available</p>
            ) : (
                posts.map((post: {
                    q_number: string;
                    question_text: string;
                    picture_link: string;
                    answer: any;
                    option_1: any;
                    option_2: any;
                }) => {
                    // Array of options with their descriptions
                    const options = [
                        {value: "1", description: post.answer},
                        {value: "b", description: post.option_1},
                        {value: "c", description: post.option_2}
                    ];

                    // Shuffle descriptions while keeping the keys fixed
                    const shuffledOptions = shuffleArray(options);

                    return (
                        <>
                            <Questioncard
                                key={post.q_number}
                                questionNumber={post.q_number}
                                questionText={post.question_text}
                                imageSrc={post.picture_link}
                                radioOptions={shuffledOptions.map((option: any, index: string | any) => ({
                                    ...option,
                                    label: ['A', 'B', 'C'][index] // Keep labels in A, B, C order
                                }))}
                                onAnswerChange={(value) => handleAnswerChange(post.q_number, value)}
                            />
                            {/*<p>*/}
                            {/*    selected option:{answers[post.q_number]}*/}
                            {/*    <br/>*/}
                            {/*    score:{calculateScore()}*/}
                            {/*</p>*/}
                        </>
                    );
                })
            )}
        </div>)
}
