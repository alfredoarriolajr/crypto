import { useState } from 'react';

const samplePrompts = [
    'a gentleman otter in a 19th century portrait',
    'bowl of ramen in the style of a comic book',
    'flower field drawn by Jean-Jacques Sempé',
    'illustration of a taxi cab in the style of r crumb',
    'multicolor hyperspace',
    'painting of fruit on a table in the style of Raimonds Staprans',
    'pencil sketch of robots playing poker',
    'photo of an astronaut riding a horse',
    'an astronaut riding a horse on mars artstation, hd, dramatic lighting, detailed',
    'a cat in a space helmet artstation, hd, dramatic lighting, detailed',
    'dark room with volumetric light god rays shining through window onto stone fireplace in front of cloth couch',
    'a full page design of spaceship engine, black and bronze paper, intricate, highly detailed',
    'futuristic tree house, hyper realistic, epic composition, cinematic, landscape vista',
    'pikachu eating spagetti, cute, funny, colorful, cartoon',
];
import sample from 'lodash/sample';

export default function PromptForm(props) {
    const [prompt] = useState(sample(samplePrompts));
    // console.log('prompt', prompt);
    const [image, setImage] = useState(null);

    return (
        <form
            onSubmit={props.onSubmit}
            className='py-5 animate-in fade-in duration-700'>
            <div className='flex max-w-[512px]'>
                <input
                    type='text'
                    defaultValue={prompt}
                    name='prompt'
                    placeholder='Enter a prompt...'
                    className='block w-full flex-grow rounded-l-md'
                />

                <button
                    className='bg-black text-white rounded-r-md text-small inline-block px-3 flex-none'
                    type='submit'>
                    Generate
                </button>
            </div>
        </form>
    );
}
