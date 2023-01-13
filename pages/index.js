
import Head from 'next/head';
import Home from '../components/paint';

export default function About() {

    return (
        <div className='max-w-[512px] mx-auto p-10 bg-white rounded-lg'>
            <Head>
                <title>Cryptonized</title>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
            </Head>
            <p className='pb-5 text-lg'>
                <strong>Cryptonized.net</strong> Create NFTs from your images
                and texts. Highlight unwanted parts of the image and let the
                model generate a new inpainted image with your new idea. Create
                something special and unique. Powered by Near Protocol
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
                    model generate a new inpainted image.
                </li>
            </ol>
        </div>
    );
}
