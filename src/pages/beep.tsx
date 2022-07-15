import Head from 'next/head'
import { Box, Button, Center, HStack, Stack } from '@chakra-ui/react'
import React, { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useAudioContext } from '../component/AudioCtx'


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
    oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime)
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1)
    oscillator.connect(audioCtx.destination)
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.2)
  }
  return <Stack>
    <Button onClick={() => { onPress() }} colorScheme={"teal"}>
      ピポッ
    </Button>
  </Stack>

}

const SoundButton2 = () => {
  // pi pi
  const onPress = () => {
    const audioCtx = new window.AudioContext()

    const nodes = [
      audioCtx.createOscillator(),
      audioCtx.createOscillator()
    ]
    const hz = 1700
    nodes.map(node => {
      node.type = 'sine'
      node.frequency.setValueAtTime(hz, audioCtx.currentTime)
      node.connect(audioCtx.destination)
    })

    const length = 0.1
    const rest = 0.025
    nodes[0].start(audioCtx.currentTime)
    nodes[0].stop(audioCtx.currentTime + length)
    nodes[1].start(audioCtx.currentTime + length + rest)
    nodes[1].stop(audioCtx.currentTime + length * 2 + rest)
  }

  return <Stack>
    <Button onClick={() => { onPress() }} colorScheme={"teal"}>
      ピピッ
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
              <SoundButton2 />
            </HStack>
          </SoundReady>
        </Center>
      </Box>
    </Box>
  )
}
