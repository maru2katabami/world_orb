"use client"

import { Perf } from "r3f-perf"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { Orb } from "./orb"
import { Map } from "./map"

export const ThreeJS = () => {
  return (
    <Canvas>
      <Environment preset="city"/>
      <ambientLight intensity={ 10 }/>
      <Physics debug>
        <Map/>
        <Orb/>
      </Physics>
      <Perf/>
    </Canvas>
  )
}