import { useCallback, useEffect, useState } from "react"

export default function useTouch() {

  const [ init, setInit ] = useState({ x: null, y: null })
  const [ one, setOne ] = useState({ x: null, y: null, distance: 0, angle: 0 })
  const [ two, setTwo ] = useState({ x: null, y: null, timestamp: null, hold: 0 })
  const [ force, setForce ] = useState({ forward: 0, backward: 0, left: 0, right: 0 })

  const handleStart = useCallback( event => {
    setInit({ x: event.touches[0].clientX, y: event.touches[0].clientY })
    if ( event.touches[1]) setTwo({ x: touches[1].clientX, y: touches[1].clientY, timestamp: Date.now()})
  }, [])

  const handleMove = useCallback( event => {
    if ( !init.x ) return
    const x = event.touches[0].clientX
    const y = event.touches[0].clientY
    const dx = x - init.x
    const dy = y - init.y
    const distance = Math.sqrt( dx * dx + dy * dy )
    const clampedDistance = Math.min( distance, 200 )
    const normalizedDistance = clampedDistance / 200 || 0
    const normalizedDx = dx / distance || 0
    const normalizedDy = dy / distance || 0
    const forward = dy < 0 ? normalizedDy * normalizedDistance : 0
    const backward = dy > 0 ? normalizedDy * normalizedDistance : 0
    const right = dx > 0 ? normalizedDx * normalizedDistance : 0
    const left = dx < 0 ? normalizedDx * normalizedDistance : 0
    setOne({ x, y, distance: clampedDistance, angle: Math.atan2( dy, dx ) * ( 180 / Math.PI )})
    setForce({ forward, backward, left, right })
  }, [ init ])

  const handleEnd = useCallback(() => {
    setInit({ x: null, y: null })
    setOne({ x: null, y: null, distance: 0, angle: 0 })
    setTwo({ x: null, y: null, timestamp: null, hold: Date.now() - two.timestamp })
    setForce({ forward: 0, backward: 0, left: 0, right: 0 })
  }, [])

  useEffect(() => {
    window.addEventListener("touchstart", handleStart )
    window.addEventListener("touchmove", handleMove )
    window.addEventListener("touchend", handleEnd )
    return () => {
      window.removeEventListener("touchstart", handleStart )
      window.removeEventListener("touchmove", handleMove )
      window.removeEventListener("touchend", handleEnd )
    }
  }, [ handleStart, handleMove, handleEnd ])

  const TouchUI = () => (
    <div className="absolute top-0 size-full touch-none pointer-events-none">
      <div
        className={`absolute size-20 rounded-full ${ !init.x && "hidden"} overflow-visible`}
        style={{
          left: `${ init.x }px`,
          top: `${ init.y }px`,
          transform: `translate(-50%,-50%)`,
        }}>
        <div
          className={`absolute top-1/2 left-1/2 min-w-20 h-20 rounded-full`}
          style={{
            width: `${ Math.max( one.distance + 40, 80 )}px`,
            boxShadow: "inset 0 0 50px skyblue",
            transform: `translate(-40px,-50%) rotate(${ one.angle }deg)`,
            transformOrigin: "40px center",
            clipPath: one.distance >= 60 ? `polygon(0 0, calc(0% + 45px) 0, 100% 45%, 100% 55%, calc(0% + 45px) 100%, 0 100%)`: undefined,
            transition: "clip-path 0.5s ease-in-out"
          }}/>
      </div>
      {/* Debug UI */}
      <ul className="absolute p-5 bottom-5 right-5 w-80 h-40 rounded-lg border-2 pointer-events-none">
        <li>Forward: { force.forward }</li>
        <li>Backward: { force.backward }</li>
        <li>Left: { force.left }</li>
        <li>Right: { force.right }</li>
      </ul>
    </div>
  )

  return { force, two, TouchUI }
}
