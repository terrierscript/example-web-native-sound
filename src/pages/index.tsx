import { Box, Button, Center, Stack } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useEffect, useMemo, useRef, useState } from 'react'


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
  oscillator.stop(0.1)

}
const SoundButton = () => {
  const [ready, setReady] = useState(false)

  const onSetup = () => {
    playReadySound(() => {
      setReady(true)
    })
  }

  const onPress = () => {
    const audioCtx = new window.AudioContext()

    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime + 0.2)
    oscillator.connect(audioCtx.destination)

    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.5)

  }
  if (!ready) {
    return <Button onClick={() => onSetup()}>
      Setup
    </Button>
  }
  return <Stack>
    <Button onClick={() => { onPress() }}>
      Bang
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
        <Center flex={1}>
          <SoundButton />
        </Center>
      </Box>
    </Box>
  )
}
