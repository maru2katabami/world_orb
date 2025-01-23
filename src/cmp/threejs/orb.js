import { useRef, useState } from "react"
import { useTouch } from "@/hooks"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { Vector3, Spherical } from "three"

export const Orb = () => {

  const ref = useRef( null )
  const [ isOn, setIsOn ] = useState( false )
  const { force, two } = useTouch()

  const spherical = useRef( new Spherical( 10, Math.PI / 4, 0 ))
  const moveSpeed = 1
  const lerpSpeed = 0.1
  const jumpImpulse = 5 // ジャンプの強さを調整

  const movement = new Vector3()
  const direction = new Vector3()
  const forward = new Vector3()
  const right = new Vector3()
  const impulse = new Vector3()
  const newCameraPosition = new Vector3()

  useFrame(({ camera }) => {
    if ( !ref.current ) return

    // 移動処理
    movement.set( force.left + force.right, 0, force.forward + force.backward )
    camera.getWorldDirection( direction )
    forward.set( -direction.x, 0, -direction.z ).normalize()
    right.crossVectors( new Vector3( 0, 1, 0 ), forward ).normalize()

    impulse.set( 0, 0, 0 ).addScaledVector( forward, movement.z * moveSpeed ).addScaledVector( right, movement.x * moveSpeed )

    ref.current.applyImpulse( impulse, true )

    // ジャンプ処理
    if ( two.timestamp !== null ) ref.current.applyImpulse( new Vector3( 0, jumpImpulse, 0 ), true )

    // カメラの追従処理
    const targetPosition = ref.current.translation()
    spherical.current.theta -= movement.x * 0.05
    spherical.current.phi = Math.max( 0.1, Math.min( Math.PI / 2 - 0.1, spherical.current.phi ))
    spherical.current.makeSafe()
    newCameraPosition.setFromSpherical( spherical.current ).add( targetPosition )

    camera.position.lerp( newCameraPosition, lerpSpeed )
    camera.lookAt( targetPosition.x, targetPosition.y + 3, targetPosition.z )
  })

  return (
    <RigidBody
      ref={ ref }
      colliders="ball"
      lockRotations
      position={[ 0, 5, 0 ]}
      restitution={ 0.3 }
      onCollisionEnter={() => setIsOn( true )}
      onIntersectionExit={() => setIsOn( false )}>
      <mesh>
        <sphereGeometry args={[ 1 ]}/>
        <meshNormalMaterial/>
      </mesh>
    </RigidBody>
  )
}
