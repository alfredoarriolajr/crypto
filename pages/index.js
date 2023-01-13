import Head from 'next/head';
import Home from '../components/paint';

export default function About() {
    return (
        <div className='max-w-[512px] mx-auto p-4 bg-white rounded-lg'>
            <Head>
                <title>Cryptonized</title>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
            </Head>
            <p className='pb-5 text-lg text-center'>
                <strong>Cryptonized.net</strong>
            </p>
            <p>
                Create NFTs from your images and texts. Highlight unwanted parts
                of the image and let the model generate a new image with your
                new idea. Mint your NFTs on the Near Protocol blockchain.
            </p>
            <Home />
            <ol className='list-decimal pl-5'>
                <li className='mb-2'>
                    Enter a text prompt to generate an image, or upload your own
                    starting image.
                </li>
                <li className='mb-2'>
                    Click and drag with your mouse to erase unwanted parts of
                    the image.
                </li>
                <li className='mb-2'>
                    Refine your text prompt (or leave it untouched) and let the
                    model generate a new image.
                </li>
            </ol>
            <div class='max-w-screen-xl px-4 pt-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8'>
                <p class='mt-16 text-base leading-6 text-center'>
                    © 2023 Cryptonized.net by{' '}
                    <a
                        href='https://www.linkedin.com/in/alfredoarriolajr/'
                        className='underline'>
                        Alfredo Arriola Jr.
                    </a>
                </p>
            </div>
        </div>
    );
}
