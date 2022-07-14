import React, { createContext, FC, useContext, useEffect, useRef, useState } from "react"
import { render } from "react-dom"
import { Synth } from "tone"
import styled from "styled-components"
import { Box, Button } from "@chakra-ui/react"
import { useAudioContext } from "../component/AudioCtx"

const ToneContext = createContext({
  synth: new Synth().toMaster()
})

const area = `
  "ccr ddb ddb ddr eeb eeb eer ffr ggb ggb ggr aab aab aar bbb bbb bbr"
  "ccw ccw ddw ddw ddw eew eew ffw ffw ggw ggw ggw aaw aaw aaw bbw bbw"
`

const Area = styled.div`
  grid-area: ${({ area }) => area};
  height: 10em;
  border: 1px solid black;
  background: ${({ black }) => (black ? "black" : "white")};
  color: ${({ black }) => (black ? "white" : "black")};
  ${({ top }) => top && "border-top: 0px;"}
  ${({ bottom }) => bottom && "border-bottom: 0px;"}
`
const Grid = styled.div`
  display: grid;
  grid-template-areas: ${area};
`

// const TriggerAttackRelease = ({ note, h }) => {
//   const { synth } = useContext(ToneContext)
//   return (
//     <button
//       onClick={() => {
//         synth.triggerAttackRelease(note, "8n")
//       }}
//     >
//       {note}
//     </button>
//   )

// }
const extra = (x: "w" | "b" | "r") => {
  switch (x) {
    case "w":
      return { top: true }
    case "b":
      return { black: true, bottom: true }
    case "r":
      return { bottom: true }
  }
}
// const getNote = (key, x) => {
//   // if()
//   switch (x) {
//     case "w":
//     case "r":
//       return `${key[0]}4`
//     case "b":
//       return `${key[0]}b4`
//   }
// }

const scales = [
  ["a", 523.23],//ド
  ["s", 587.34],//レ
  ["d", 659.25],//ミ
  ["f", 698.45],//ファ
  ["g", 783.98],//ソ
  ["h", 879.99],//ラ
  ["j", 987.75],//シ
  ["k", 1046.5],//ド 
] as [string, number][]


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


  return <Area
    key={area}
    area={area}
    onMouseDown={() => start()}
    onMouseUp={() => stop()}
    onMouseLeave={() => stop()}

  ></Area>

}


const App = () => {
  const { synth } = useContext(ToneContext)

  return (
    <div>
      <div>
        <a href="https://github.com/terrierscript/example-tone" target="_blank">
          Source
        </a>
      </div>
      <Grid>
        {["cc", "dd", "ee", "ff", "gg", "aa", "bb"].map((key) =>
          ["w", "r", "b"].map((x) => {
            const area = `${key}${x}`
            if (area === "ffb" || area === "ccb") return
            const note = getNote(key, x)
            return (
              <Area
                key={area}
                area={area}
                {...extra(x)}
                onClick={() => {
                  synth.triggerAttackRelease(note, "8n")
                }}
              ></Area>
            )
          })
        )}
      </Grid>
    </div>
  )
}