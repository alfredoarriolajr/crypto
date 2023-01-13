import Head from 'next/head';
import Canvas from 'components/canvas';
import PromptForm from 'components/prompt-form';
import Dropzone from 'components/dropzone';
import Download from 'components/download';
import { XCircle as StartOverIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
    signIn,
    signOut,
    wallet,
    viewFunction,
    callFunction,
    initNear,
} from 'components/near-setup';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
    const [predictions, setPredictions] = useState([]);
    const [error, setError] = useState(null);
    const [maskImage, setMaskImage] = useState(null);
    const [userUploadedImage, setUserUploadedImage] = useState(null);
    const [user, setUser] = useState(false);
    const [newNft, setNewNft] = useState(null);
    const [showNFT, setShowNFT] = useState(false);
    const id = uuid();
    const lastItem = predictions[predictions.length - 1];
    useEffect(() => {
        initNear();
    }, []);

    useEffect(() => {
        if (wallet.getAccountId()) {
            setUser(wallet.getAccountId());
            console.log('user', user);
            console.log('contract', wallet._near.config.owner_id);
            viewFunction('nft_tokens_for_owner', {
                account_id: wallet.getAccountId(),
            }).then((res) => {
                console.log('res', res);
                setNewNft(res);
            });
        }
    }, [user]);
    console.log('userUploadedImage: ', userUploadedImage);
    console.log('predictions', lastItem?.output);

    const createNFT = async () => {
        await callFunction(
            'nft_mint',
            {
                token_id: id,
                metadata: {
                    title: 'Cryptonized.net',
                    description: 'AI Generated NFT',
                    media: lastItem.output || userUploadedImage,
                },
                receiver_id: user,
            },
            '1', // attached GAS (optional)
            '7730000000000000000000' // attached GAS (optional)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const prevPrediction = predictions[predictions.length - 1];
        const prevPredictionOutput = prevPrediction?.output
            ? prevPrediction.output[prevPrediction.output.length - 1]
            : null;

        const body = {
            prompt: e.target.prompt.value,
            init_image: userUploadedImage
                ? await readAsDataURL(userUploadedImage)
                : // only use previous prediction as init image if there's a mask
                maskImage
                ? prevPredictionOutput
                : null,
            mask: maskImage,
        };

        const response = await fetch('/api/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const prediction = await response.json();

        if (response.status !== 201) {
            setError(prediction.detail);
            return;
        }
        setPredictions(predictions.concat([prediction]));

        while (
            prediction.status !== 'succeeded' &&
            prediction.status !== 'failed'
        ) {
            await sleep(1000);
            const response = await fetch('/api/predictions/' + prediction.id);
            prediction = await response.json();
            if (response.status !== 200) {
                setError(prediction.detail);
                return;
            }
            setPredictions(predictions.concat([prediction]));

            if (prediction.status === 'succeeded') {
                setUserUploadedImage(null);
            }
        }
    };

    const startOver = async (e) => {
        e.preventDefault();
        setPredictions([]);
        setError(null);
        setMaskImage(null);
        setUserUploadedImage(null);
    };

    return (
        <div>
            <Head>
                <title>Cryptonized</title>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
            </Head>
            <main className='container mx-auto p-5'>
                {error && <div>{error}</div>}
                {user && (
                    <>
                        {newNft && (
                            <button
                                onClick={() => {
                                    setShowNFT(!showNFT);
                                }}
                                className='mb-5 py-3 block w-full text-center bg-black text-white rounded-md mt-10'>
                                {showNFT ? 'Hide NFTs' : 'Show NFTs'}
                            </button>
                        )}
                    </>
                )}
                {showNFT && (
                    <div className='text-2xl border-t-4 border-b-4 py-4 my-4'>
                        <h1>Your NFTs</h1>
                        <div class='flex flex-wrap'>
                            {newNft.map((token) => (
                                <div
                                    class='rounded-lg shadow-lg bg-white p-1 border m-1'
                                    key={token.token_id}>
                                    <a
                                        href='#!'
                                        data-mdb-ripple='true'
                                        data-mdb-ripple-color='light'>
                                        <img
                                            class='rounded-t-lg w-full'
                                            src={token.metadata.media}
                                            alt={token.metadata.title}
                                        />
                                    </a>
                                    <div class='p-6'>
                                        <h5 class='text-gray-900 text-xl font-medium mb-2'>
                                            {token.metadata.title}
                                        </h5>
                                        <p class='text-gray-700 text-base mb-4'>
                                            {token.metadata.description}
                                        </p>
                                        <button
                                            onClick={() => {
                                                handleTransfer(token.token_id);
                                            }}
                                            type='button'
                                            class=' inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                                            Transfer NFT
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className='border-hairline max-w-[512px] mx-auto relative'>
                    <Dropzone
                        onImageDropped={setUserUploadedImage}
                        predictions={predictions}
                        userUploadedImage={userUploadedImage}
                    />
                    <div
                        className='bg-gray-50 relative max-h-[512px] w-full flex items-stretch'
                        // style={{ height: 0, paddingBottom: "100%" }}
                    >
                        <Canvas
                            predictions={predictions}
                            userUploadedImage={userUploadedImage}
                            onDraw={setMaskImage}
                        />
                    </div>
                </div>

                <div className='max-w-[512px] mx-auto'>
                    <PromptForm onSubmit={handleSubmit} />

                    <div className='text-center'>
                        {((predictions.length > 0 &&
                            predictions[predictions.length - 1].output) ||
                            maskImage ||
                            userUploadedImage) && (
                            <button className='lil-button' onClick={startOver}>
                                <StartOverIcon className='icon' />
                                Start over
                            </button>
                        )}

                        <Download predictions={predictions} />
                    </div>
                </div>

                {!user && (
                    <button
                        onClick={() => {
                            signIn();
                        }}
                        className='py-3 w-full block text-center bg-black text-white rounded-md mt-10'>
                        Near Login
                    </button>
                )}
                {user && (
                    <>
                        <button
                            onClick={() => {
                                createNFT();
                            }}
                            className='py-3 w-full block text-center bg-black text-white rounded-md mt-10'>
                            Cryptonized it!
                        </button>
                        <button
                            onClick={() => {
                                signOut();
                                setUser(false);
                                setNewNft([]);
                            }}
                            className='py-3 block w-full text-center bg-black text-white rounded-md mt-10'>
                            Log Out
                        </button>
                    </>
                )}
            </main>
        </div>
    );
}

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = reject;
        fr.onload = () => {
            resolve(fr.result);
        };
        fr.readAsDataURL(file);
    });
}
