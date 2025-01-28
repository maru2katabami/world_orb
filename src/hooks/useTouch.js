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
    setInit(prevInit => {
      const prevInitMap = new Map(prevInit.map(t => [t.identifier, t]));
      const newTouches = Array.from(event.touches).map(touch => 
        prevInitMap.get(touch.identifier) || touch // 既存の指の位置を保持
      );
      return newTouches;
    });
  },[])

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
    } else if ( event.touches.length === 1 ) {
      const remainingTouches = Array.from(event.touches);
      const updatedInit = init.filter((touch) =>
        remainingTouches.some((t) => t.identifier === touch.identifier)
      )
      setInit(updatedInit);
    }
  },[])

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
              width: `${ Math.max( distance + 40, 80 )}px`,
              boxShadow: "inset 60px 0 30px #00000055",
              background: "linear-gradient( to right, #FFFFFF55, transparent )",
              clipPath: distance >= 60 ? `polygon(0 0, calc(0% + 45px) 0, 100% 40%, 100% 60%, calc(0% + 45px) 100%, 0 100%)`: undefined,
              transition: "clip-path 0.5s ease-in-out"
             }}/>
      </div>
    )
  }

  return { init, move, force, TouchUI }
}