import Head from 'next/head'
import { Box, Button, Center, HStack, Stack } from '@chakra-ui/react'
import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'

const SoundReady: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [ready, setReady] = useState(false)
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
    oscillator.stop(0)
  }

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

  return <>{children}</>
}

const SoundButton1 = () => {
  // pi po
  const onPress = () => {
    const audioCtx = new window.AudioContext()

    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(1300, audioCtx.currentTime)

    oscillator.detune.setValueAtTime(900, audioCtx.currentTime + 0.2)
    oscillator.connect(audioCtx.destination)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.4)
  }
  return <Stack>
    <Button onClick={() => { onPress() }} colorScheme={"teal"}>
      ピポッ
    </Button>
  </Stack>

}

const SoundBoo = () => {
  const audioCtxRef = useRef<AudioContext>()
  const oscillatorRef = useRef<OscillatorNode>()
  useEffect(() => {
    audioCtxRef.current = new AudioContext()
  }, [])
  const start = () => {
    if (!audioCtxRef.current || oscillatorRef.current) {
      return
    }
    const audioCtx = audioCtxRef.current
    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(100, audioCtx.currentTime)
    oscillator.connect(audioCtx.destination)
    oscillatorRef.current = oscillator
    oscillator.start(audioCtx.currentTime)
  }
  const stop = () => {
    if (!audioCtxRef.current) {
      return
    }
    oscillatorRef.current?.stop(audioCtxRef.current.currentTime)
    oscillatorRef.current?.disconnect()
    oscillatorRef.current = undefined
  }

  return <Stack>
    <Button
      onMouseDown={() => start()}
      onMouseUp={() => stop()}
      onMouseOut={() => stop()}
      colorScheme={"red"} variant="outline">
      ブー ❌
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
        <Center flex={1} p={10}>
          <SoundReady>
            <HStack>
              <SoundButton1 />
              <SoundBoo />
            </HStack>
          </SoundReady>
        </Center>
      </Box>
    </Box>
  )
}
