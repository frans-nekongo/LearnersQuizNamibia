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
                .schema("learnersquizNA")
                .from('question')
                .select('*')
                // .schema("public")
                // .from('table_name')
                // .select('*')

            setPosts(table_name)
            setIsLoading(false)
        }

        fetchPosts()
    }, [])

    return isLoading ? <p>Loading</p> : <pre>{JSON.stringify(posts, null, 2)}</pre>
    // return (
    //     <div className="grid grid-flow-row-dense grid-cols-2  gap-4">
    //         {posts.length === 0 ? (
    //             <p>No data available</p>
    //         ) : (
    //             posts.map((post) => (
    //                 // <Card key={post.id} className="py-4 bg-white/5">
    //                 //     <h3>{post.name}</h3>
    //                 //     <p>ID: {post.id}</p>
    //                 //     <p>Inserted At: {post.inserted_at}</p>
    //                 //     <p>Updated At: {post.updated_at}</p>
    //                 //     <p>Data: {post.data}</p>
    //                 // </Card>
    //                 <Questioncard questionNumber={post.id} questionText={post.name} imageSrc={""} radioDes1={""} radioDes2={""} radioDes3={""}/>
    //
    //             ))
    //         )}
    //     </div>
    // )
}
