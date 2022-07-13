import Head from 'next/head'
import { Box, Button, Center, HStack, Stack } from '@chakra-ui/react'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { AudioProvider, useAudioContext } from '../component/AudioCtx'


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

const scales = [
  ["a", 523.23],//ド	
  ["s", 587.34],//レ	
  ["d", 659.25],//ミ	
  ["f", 698.45],//ファ
  ["g", 783.98],//ソ	
  ["h", 879.99],//ラ	
  ["j", 987.75],//シ	
  ["k", 1046.5],//ド	 
]

const Key: FC<{ scale: number, keyCode: string }> = ({ scale, keyCode }) => {
  const [play, setPlay] = useState(false)
  const audioCtx = useAudioContext()
  const oscillatorRef = useRef<OscillatorNode>()
  const start = () => {
    if (!audioCtx || oscillatorRef.current) {
      return
    }
    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(scale, audioCtx.currentTime)
    oscillator.connect(audioCtx.destination)
    oscillatorRef.current = oscillator
    setPlay(true)
    oscillator.start(audioCtx.currentTime)
  }
  const stop = () => {
    if (!audioCtx) {
      return
    }
    oscillatorRef.current?.stop(audioCtx.currentTime)
    oscillatorRef.current?.disconnect()
    oscillatorRef.current = undefined
    setPlay(false)
  }
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === keyCode) { start() }
    }
    const onKeyUp = (ev: KeyboardEvent) => {
      if (ev.key === keyCode) { stop() }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [])


  return <Box>
    <Button
      colorScheme={play ? "blue" : "green"}
      onMouseDown={() => start()} onMouseUp={() => stop()} onMouseLeave={() => stop()}>
      {keyCode}
    </Button>
  </Box>
}
const SoundButton = () => {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState("none")
  const audioCtx = useAudioContext()

  useEffect(() => {
    if (!audioCtx) {
      return
    }
    const listener = (event: Event) => {
      setState(audioCtx.state)
    }
    audioCtx.addEventListener("statechange", listener)
    return () => {
      console.log("remove")
      audioCtx.removeEventListener("statechange", listener)
    }
  }, [audioCtx])
  const onSetup = () => {
    playReadySound(() => {
      setReady(true)
    })
  }

  if (!ready) {
    return <Button onClick={() => onSetup()}>
      Setup
    </Button>
  }
  return <HStack>
    {scales.map(([keyCode, scale]) => {
      return <Key key={keyCode} keyCode={keyCode} scale={scale} />
    })}
  </HStack>
}

export default function Home() {
  return (
    <Box>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <AudioProvider>
          <Center flex={1} p={10}>
            <SoundButton />
          </Center>
        </AudioProvider>
      </Box>
    </Box>
  )
}
