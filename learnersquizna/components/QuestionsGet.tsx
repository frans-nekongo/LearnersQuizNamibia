'use client'

import {useEffect, useState} from 'react'
import {createClient} from '@/utils/supabase/client'
import {Card} from "@nextui-org/react";
import {Questioncard} from "@/components/Questioncard";

export default function QuestionsGet() {
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<any>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchPosts = async () => {

            let {data: table_name, error} = await supabase
                // .from('learnersquizNA.question')
                .schema("public")
                .from('question')
                .select('*')
                .order('q_number', {ascending: true})
                .eq('q_set', 'A')
            // .schema("public")
            // .from('table_name')
            // .select('*')

            setPosts(table_name)
            setIsLoading(false)
        }

        fetchPosts()
    }, [])

    function handleAnswerChange(q_number: string, value: string) {
        return "";
    }

    // return isLoading ? <p>Loading</p> : <pre>{JSON.stringify(posts, null, 2)}</pre>
    return isLoading ?
        <p>Loading</p> :
        <div className="grid grid-flow-row-dense grid-cols-2  gap-4">
            {posts.length === 0 ? (
                <p>No data available</p>
            ) : (
                posts.map((post: { q_number: string; question_text: string; picture_link: string; answer: any; option_1: any; option_2: any; }) => (
                    <Questioncard
                        questionNumber={post.q_number}
                        questionText={post.question_text}
                        imageSrc={post.picture_link}
                        radioOptions={[
                            {value: "a", description: post.answer, label: "A"},
                            {value: "b", description: post.option_1, label: "B"},
                            {value: "c", description: post.option_2, label: "C"}
                        ]} onAnswerChange={(value) => handleAnswerChange(post.q_number, value)}/>
                ))
            )}
        </div>
}
