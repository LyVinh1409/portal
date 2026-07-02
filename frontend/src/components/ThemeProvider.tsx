"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextValue = {
  dark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ dark: false, toggle: () => {} })

export function useTheme(){ return useContext(ThemeContext) }

export default function ThemeProvider({ children }:{ children: React.ReactNode }){
  const [dark, setDark] = useState<boolean>(false)
  useEffect(()=>{
    try{ const v = localStorage.getItem('theme'); if(v === 'dark'){ setDark(true); document.documentElement.classList.add('dark') } else { setDark(false); document.documentElement.classList.remove('dark') } }catch(_){}
  }, [])
  function toggle(){ const next = !dark; setDark(next); try{ localStorage.setItem('theme', next ? 'dark' : 'light') }catch(_){}; if(next) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark') }
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>
}
