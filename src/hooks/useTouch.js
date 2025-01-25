import { useCallback, useEffect, useState } from "react";

export default function useTouch() {
  const [ init, setInit ] = useState([])
  const [ move, setMove ] = useState([])
  const [ distance, setDistance ] = useState( 0 )
  const [ angle, setAngle ] = useState( 0 )
  const [ force, setForce ] = useState({ forward: 0, backward: 0, left: 0, right: 0 })

  const handleDistanceAngle = ( init, move ) => {
    const dx = move.clientX - init.clientX
    const dy = move.clientY - init.clientY
    const ds = Math.sqrt( dx * dx + dy * dy )
    const clampedDistance = Math.min( ds, 300 )
    const normalizedDistance = clampedDistance / 300 || 0
    const normalizedDx = dx / ds || 0
    const normalizedDy = dy / ds || 0
    const forward = dy < 0 ? normalizedDy * normalizedDistance : 0
    const backward = dy > 0 ? normalizedDy * normalizedDistance : 0
    const right = dx > 0 ? normalizedDx * normalizedDistance : 0
    const left = dx < 0 ? normalizedDx * normalizedDistance : 0
    setDistance( clampedDistance )
    setAngle( Math.atan2( dy, dx ) * ( 180 / Math.PI ))
    setForce({ forward, backward, left, right })
  }

  const handleStart = useCallback( event => {
    const touches = init
    event.touches.length === 1 ? touches.push( event.touches[0]):
    event.touches.length === 2 ? touches.push( event.touches[1]):
    event.touches.length === 3 ? touches.push( event.touches[2]):
    event.touches.length === 4 ? touches.push( event.touches[3]):
    event.touches.length === 5 ? touches.push( event.touches[4]): null
    setInit( touches )
  },[ init ])

  const handleMove = useCallback( event => {
    if ( !init.length ) return
    handleDistanceAngle( init[0], event.touches[0])
    setMove([...event.touches ])
  },[ init, move ])

  const handleEnd = useCallback( event => {
    if ( event.touches.length === 0 ) {
      setInit([])
      setMove([])
      setDistance( 0 )
      setAngle( 0 )
      setForce({ forward: 0, backward: 0, left: 0, right: 0 })
    } else if ( event.touches.length = 2 ) {
      setInit([ init[0]])
    }
  },[ init, move, distance, angle, force ])

  useEffect(() => {
    window.addEventListener("touchstart", handleStart )
    window.addEventListener("touchmove", handleMove )
    window.addEventListener("touchend", handleEnd )
    return () => {
      window.removeEventListener("touchstart", handleStart )
      window.removeEventListener("touchmove", handleMove )
      window.removeEventListener("touchend", handleEnd )
    }
  }, [ handleMove ])

  const TouchUI = () => {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 size-20 overflow-visible"
           style={{
            top: init.length ? `${init[0].clientY}px` : "none",
            left: init.length ? `${init[0].clientX}px` : "none",
            opacity: distance,
            transition: "opacity 1s",
           }}>
        <div className="absolute top-1/2 left-1/2 h-20 rounded-full"
             style={{
              transform: `translate(-40px,-50%) rotate(${ angle }deg)`,
              transformOrigin: "40px center",
              width: `${ Math.max( distance, 80 )}px`,
              background: "linear-gradient( to right, #00FFFF55, #00FFFF00 )",
              clipPath: distance >= 60 ? `polygon(0 0, calc(0% + 45px) 0, 100% 40%, 100% 60%, calc(0% + 45px) 100%, 0 100%)`: undefined,
              transition: "clip-path 0.5s ease-in-out"
             }}/>
      </div>
    )
  }

  return { init, move, force, TouchUI }
}