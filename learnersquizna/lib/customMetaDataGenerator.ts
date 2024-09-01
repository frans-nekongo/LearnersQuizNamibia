// File location: @/lib/customMetaDataGenerator.ts
import {Metadata} from 'next';

interface PageSEOProps {
    title: string;
    description?: string;
    canonicalUrl?: string;
    ogType?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
    ogImage?: string;
    twitterCard?: 'summary_large_image' | 'summary' | 'player' | 'app'; // Restricting to specific types
    keywords?: string[];
}

export function customMetaDataGenerator({
                                            title,
                                            description = "Your Namibian Learners Licence test online! to improve your chances of passing on the first attempt.",
                                            canonicalUrl = 'https://namibianlearnerstest.frans-nekongo.com/',
                                            ogType = 'website',
                                            keywords = [
                                                "Namibian learners licence test",
                                                "NaTIS Questions and Answers",
                                                "Namibia NaTIS test preparation",
                                                "learners licence test Namibia",
                                                "online Namibian driving test",
                                                "Namibia road safety",
                                                "NaTIS exam tips",
                                                "learners licence practice Namibia",
                                                "Namibian driving licence preparation",
                                                "Namibian learners permit test",
                                                "Namibian driving school resources",
                                                "NaTIS Questions and Answers",
                                                "Elidge Namibian Learners",
                                                "Elidge",
                                                "Namibian learners licence test online",
                                                "Namibian learners licence Quiz",
                                                "learners licence practice Namibia",
                                                "learners licence test frans",
                                                "Practice learners online",
                                                "Practice learners licence practice Namibia",
                                                "Practice learners licence Namibia",
                                                "Practice Namibian learners licence test",
                                                "Practice Namibian learners licence test online",
                                                "learners licence online",
                                                "Namibian learners licence test online",
                                                "Namibian learners licence online",
                                            ],
                                            ogImage = 'https://isqkzbwoiunnqsltbfpa.supabase.co/storage/v1/object/public/WebsiteLogo/logo.ico?t=2024-07-25T21%3A32%3A36.405Z',
                                            twitterCard = 'summary_large_image', // Default to 'summary_large_image'
                                        }: PageSEOProps): Metadata {

    // Create Site Title
    const siteTitle = 'Online';
    const fullTitle = `${title} | ${siteTitle}`;

    const defaultUrl = "https://namibianlearnerstest.frans-nekongo.com/"
        ? `https://namibianlearnerstest.frans-nekongo.com/`
        : "http://localhost:3000";

    return {
        generator: 'Next.js',
        applicationName: 'Namibian Learners Licence Test',
        // authors: [{name: 'Frans Nekongo', url: 'https://frans-nekongo.com/'}],
        metadataBase: new URL(defaultUrl),
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        openGraph: {
            title: fullTitle,
            description,
            type: ogType,
            url: canonicalUrl,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            card: twitterCard,
            title: fullTitle,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: canonicalUrl,
        },
        // App-specific metadata
        appleWebApp: {
            capable: true,
            title: fullTitle,
            statusBarStyle: 'black-translucent',
        },
        // Robots directives
        robots: {
            index: true,
            follow: true,
            nocache: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}
