"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { Orb } from "./orb"
import { Perf } from "r3f-perf"
import Mapping from "./mapping"

export const ThreeJS = () => {
  return (
    <Canvas>
      <Environment preset="city"/>
      <ambientLight intensity={ 10 }/>
      <Physics debug>
        <Mapping/>
        <Orb/>
      </Physics>
      <Perf/>
    </Canvas>
  )
}