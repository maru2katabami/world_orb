import { useCallback, useEffect, useState } from "react";

export default function useTouch() {
  const [init, setInit] = useState([]);
  const [move, setMove] = useState([]);
  const [distance, setDistance] = useState(0);
  const [angle, setAngle] = useState(0);
  const [force, setForce] = useState({ forward: 0, backward: 0, left: 0, right: 0 });

  const handleDistanceAngle = (init, move) => {
    const dx = move.clientX - init.clientX;
    const dy = move.clientY - init.clientY;
    const ds = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.min(ds, 300);
    const normalizedDistance = clampedDistance / 300 || 0;
    const normalizedDx = dx / ds || 0;
    const normalizedDy = dy / ds || 0;
    const forward = dy < 0 ? normalizedDy * normalizedDistance : 0;
    const backward = dy > 0 ? normalizedDy * normalizedDistance : 0;
    const right = dx > 0 ? normalizedDx * normalizedDistance : 0;
    const left = dx < 0 ? normalizedDx * normalizedDistance : 0;
    setDistance(clampedDistance);
    setAngle(Math.atan2(dy, dx) * (180 / Math.PI));
    setForce({ forward, backward, left, right });
  };

  const handleStart = useCallback((event) => {
    const touches = Array.from(event.touches).map((touch) => ({
      identifier: touch.identifier,
      clientX: touch.clientX,
      clientY: touch.clientY,
    }));
    setInit(touches);
  }, []);

  const handleMove = useCallback(
    (event) => {
      if (!init.length) return;

      const updatedTouches = Array.from(event.touches).map((touch) => ({
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
      }));

      const movingTouch = updatedTouches.find((touch) => touch.identifier === init[0]?.identifier);
      if (movingTouch) {
        handleDistanceAngle(init[0], movingTouch);
      }
      setMove(updatedTouches);
    },
    [init]
  );

  const handleEnd = useCallback(
    (event) => {
      const remainingTouches = Array.from(event.touches).map((touch) => ({
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY,
      }));

      setInit((prevInit) => prevInit.filter((touch) => remainingTouches.some((t) => t.identifier === touch.identifier)));
      setMove(remainingTouches);

      if (!remainingTouches.length) {
        setDistance(0);
        setAngle(0);
        setForce({ forward: 0, backward: 0, left: 0, right: 0 });
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("touchstart", handleStart);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  const TouchUI = () => {
    return (
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 size-20 overflow-visible"
        style={{
          top: init.length ? `${init[0].clientY}px` : "none",
          left: init.length ? `${init[0].clientX}px` : "none",
          opacity: distance,
          transition: "opacity 1s",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 h-20 rounded-full"
          style={{
            transform: `translate(-40px,-50%) rotate(${angle}deg)`,
            transformOrigin: "40px center",
            width: `${Math.max(distance + 40, 80)}px`,
            boxShadow: "inset 60px 0 30px #00000055",
            background: "linear-gradient( to right, #FFFFFF55, transparent )",
            clipPath:
              distance >= 60
                ? `polygon(0 0, calc(0% + 45px) 0, 100% 40%, 100% 60%, calc(0% + 45px) 100%, 0 100%)`
                : undefined,
            transition: "clip-path 0.5s ease-in-out",
          }}
        />
      </div>
    );
  };

  return { init, move, force, TouchUI };
}
