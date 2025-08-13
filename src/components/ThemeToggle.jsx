import React, {useEffect, useState } from 'react';

export default function ThemeToggle(){
    const THEME_KEY = 'savedTheme';

    // function to get theme from local storage if it has saved previously otherwise I've made light as default.
    const getThemeFromLocalStorage = () => {
        return localStorage.getItem(THEME_KEY);
    }

    const [theme,setTheme] = useState(getThemeFromLocalStorage() || 'light');

    useEffect(()=>{
        const root = document.documentElement;
        if(theme==='dark') root.classList.add('dark');
        else root.classList.remove('dark');

        localStorage.setItem(THEME_KEY,theme);
    },[theme])

    return (
        <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className='rounded-md border-2 px-3 py-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'>
            {theme==='dark'?'Light':'Dark'}
        </button>
    )
}