// components/SectionImage2.tsx

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Image } from "@nextui-org/react";

interface SectionImageProps {
    selectedSet: string;
}

const SectionImage2: React.FC<SectionImageProps> = ({ selectedSet }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchImage = async () => {
            setIsLoading(true);

            const localStorageKey = `section-image-${selectedSet}`;
            const cachedImageUrl = localStorage.getItem(localStorageKey);

            // Fetch image URL from the server
            let { data: sectionPictures, error } = await supabase
                .schema("public")
                .from('sectionpictures')
                .select('setApic, setBpic, setCpic')
                .eq('section_text', 'SECTION D - MOTOR CYCLES ONLY');

            if (error) {
                console.error('Error fetching image data:', error);
                setIsLoading(false);
                return;
            }

            const imageData = sectionPictures ? sectionPictures[0] : null;
            let fetchedImageUrl = '';

            if (imageData) {
                if (selectedSet === 'A') {
                    fetchedImageUrl = imageData.setApic || '';
                } else if (selectedSet === 'B') {
                    fetchedImageUrl = imageData.setBpic || '';
                } else if (selectedSet === 'C') {
                    fetchedImageUrl = imageData.setCpic || '';
                }
                console.log('Fetched image URL:', fetchedImageUrl); // Log the URL
            }

            if (fetchedImageUrl && fetchedImageUrl !== cachedImageUrl) {
                // Update local storage and state if the fetched URL is different
                localStorage.setItem(localStorageKey, fetchedImageUrl);
                setImageUrl(fetchedImageUrl);
            } else if (cachedImageUrl) {
                // Use cached image URL if available and the same
                setImageUrl(cachedImageUrl);
            }

            setIsLoading(false);
        };

        fetchImage();
    }, [selectedSet, supabase]);

    return (
        <div>
            {isLoading ? (
                <p>Loading image...</p>
            ) : imageUrl ? (
                <Image src={imageUrl} alt="Section Image" className="w-full" />
            ) : (
                // <p>No image available</p>
                <>
                </>
            )}
        </div>
    );
};

export default SectionImage2;
