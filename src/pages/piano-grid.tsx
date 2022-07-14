import React, { createContext, FC, useContext, useEffect, useMemo, useRef, useState } from "react"
// import { render } from "react-dom"
// import { Synth } from "tone"
import styled from "@emotion/styled"
import { Box, BoxProps, Button, Center, Grid } from "@chakra-ui/react"
import { AudioProvider, useAudioContext, useReadySound } from "../component/AudioCtx"

// const ToneContext = createContext({
//   synth: new Synth().toMaster()
// })

const area = `
  "ccr ddb ddb ddr eeb eeb eer ffr ggb ggb ggr aab aab aar bbb bbb bbr"
  "ccw ccw ddw ddw ddw eew eew ffw ffw ggw ggw ggw aaw aaw aaw bbw bbw"
`

const Area: FC<{ area: string, black: boolean, top: boolean, bottom: boolean, focus: boolean } & BoxProps> = ({ area, black, top, bottom, focus, ...props }) => {
  const bgColor = useMemo(() => {
    if (black) {
      return focus ? "gray.800" : "black"
    }
    return focus ? "gray.200" : "white"
  }, [focus, black])
  return <Box gridArea={area} height={"10em"} border={"1px solid black"}
    background={bgColor}
    color={black ? "white" : "black"}
    borderTop={top ? "0px" : "auto"}
    borderBottom={bottom ? "0px" : "auto"}
    {...props}
  />
}
const extra = (x: string) => {
  switch (x) {
    case "w":
      return { top: true }
    case "b":
      return { black: true, bottom: true }
    case "r":
      return { bottom: true }
  }
}

type ScaleMap = { [key in string]: [string, number] }
const blackScales: ScaleMap = {
  "dd": ["w", 554.37],
  "ee": ["e", 622.25],
  "gg": ["t", 739.99],
  "aa": ["y", 830.61],
  "bb": ["u", 932.33],
}
const scales: ScaleMap = {
  "cc": ["a", 523.23],//ド
  "dd": ["s", 587.34],//レ
  "ee": ["d", 659.25],//ミ
  "ff": ["f", 698.45],//ファ
  "gg": ["g", 783.98],//ソ
  "aa": ["h", 879.99],//ラ
  "bb": ["j", 987.75],//シ
  // "": ["k", 1046.5],//ド 
}


const Key: FC<{ scale: number, keyCode: string } & any> = ({ scale, keyCode, ...rest }) => {
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


  return <Area
    key={area}
    onMouseDown={() => start()}
    onMouseUp={() => stop()}
    onMouseLeave={() => stop()}
    focus={play}
    {...rest}
  >({keyCode})</Area>

}


const Piano = () => {
  // const { synth } = useContext(ToneContext)
  const playReadySound = useReadySound()
  const [ready, setReady] = useState(false)
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
  return (
    <Grid w="100%" gridTemplateAreas={area}>
      {["cc", "dd", "ee", "ff", "gg", "aa", "bb"].map((key) =>
        ["w", "r", "b"].map((x) => {
          const area = `${key}${x}`
          if (area === "ffb" || area === "ccb") return
          const scale = x === "b"
            ? blackScales[key]
            : scales[key]

          console.log(scale, area)
          // const note = getNote(key, x)
          return (
            <Key
              key={area}
              keyCode={scale?.[0]}
              scale={scale?.[1]}
              area={area}
              {...extra(x)}
            // onClick={() => {
            //   synth.triggerAttackRelease(note, "8n")
            // }}
            />
          )
        })
      )}
    </Grid>
  )
}

const App = () => {
  return <AudioProvider>
    <Center w="90vw" p={10} flex={1} >
      <Piano />
    </Center>
  </AudioProvider>
}

export default App
