"use client"

import { ThreeJS } from "@/cmp/threejs"
import { useTouch } from "@/hooks"

export default function Page() {
  const { TouchUI } = useTouch()
  return (
    <main>
      <ThreeJS/>
      <TouchUI/>
    </main>
  )
}