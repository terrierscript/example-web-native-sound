import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react"


const AudioCtx = createContext<AudioContext | null>(null)


export const AudioProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const audioCtx = useMemo(() => {
    if (typeof window === "undefined") {
      return null
    }
    console.log("nnn")
    return new window.AudioContext()
  }, [])
  return <AudioCtx.Provider value={audioCtx}>
    {children}
  </AudioCtx.Provider>
}

export const useAudioContext = () => useContext(AudioCtx)