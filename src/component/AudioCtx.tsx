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

export const useAudioContext = () => {
  const ctx = useContext(AudioCtx)
  return ctx
}

export const useReadySound = () => {
  const playReadySound = (onPlayEnd: () => void) => {
    const audioCtx = new window.AudioContext()
    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(10, audioCtx.currentTime)
    oscillator.connect(audioCtx.destination)

    oscillator.onended = () => {
      onPlayEnd()
    }
    oscillator.start(0)
    oscillator.stop(0.001)

  }
  return playReadySound
}