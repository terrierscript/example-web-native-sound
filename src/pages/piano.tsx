import Head from 'next/head'
import { Box, Button, Center, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
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
const SoundButton = () => {
  const [ready, setReady] = useState(false)
  const [state, setState] = useState("none")
  const audioCtx = useAudioContext()

  console.log(audioCtx)
  useEffect(() => {
    if (!audioCtx) {
      return
    }
    const listener = (event: Event) => {
      setState(audioCtx.state)
    }
    audioCtx.addEventListener("statechange", listener)
    return () => {
      audioCtx.removeEventListener("statechange", listener)
    }
  }, [audioCtx])
  const onSetup = () => {
    playReadySound(() => {
      setReady(true)
    })
  }

  const onPress = () => {
    const audioCtx = new window.AudioContext()

    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1)
    oscillator.connect(audioCtx.destination)

    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.2)
  }
  // if (!ready) {
  //   return <Button onClick={() => onSetup()}>
  //     Setup
  //   </Button>
  // }
  return <Stack>
    <Box>{state}</Box>
    <Button onClick={() => { onPress() }} colorScheme={"teal"}>
      beep
    </Button>
  </Stack>
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
