import { useRef, useState } from "react"
import { useTouch } from "@/hooks"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { Vector3, Quaternion, Spherical } from "three"
import { useGLTF } from "@react-three/drei"

export const Orb = () => {

  const ref = useRef( null )
  const [ isOn, setIsOn ] = useState( false )
  const { init, force } = useTouch()

  const { nodes } = useGLTF("/orb.glb")

  const spherical = useRef( new Spherical( 10, Math.PI / 4, 0 ))
  const lerpSpeed = 0.025
  const jumpImpulse = 25

  const movement = new Vector3()
  const direction = new Vector3()
  const forward = new Vector3()
  const right = new Vector3()
  const impulse = new Vector3()
  const newCameraPosition = new Vector3()

  useFrame(({ camera }) => {
    if (!ref.current) return;
  
    movement.set( force.left + force.right, 0, force.forward + force.backward )
    camera.getWorldDirection( direction )
    forward.set( -direction.x, 0, -direction.z ).normalize()
    right.crossVectors( new Vector3( 0, 1, 0 ), forward ).normalize()
  
    impulse
      .set( 0, 0, 0 )
      .addScaledVector( forward, movement.z * 1.5 )
      .addScaledVector( right, movement.x )
  
    ref.current.applyImpulse( impulse, true )
  
    if ( init.length === 2 && isOn ) ref.current.applyImpulse( new Vector3( 0, jumpImpulse, 0 ), true )
  
    const targetPosition = ref.current.translation()
    spherical.current.theta -= movement.x * 0.05
    spherical.current.phi = Math.max( 0.1, Math.min( Math.PI / 2 - 0.1, spherical.current.phi ))
    spherical.current.makeSafe()
    newCameraPosition.setFromSpherical( spherical.current ).add( targetPosition )
  
    camera.position.lerp( newCameraPosition, lerpSpeed )
    camera.lookAt( targetPosition.x, targetPosition.y + 3, targetPosition.z )
  
    const lookAtTarget = new Vector3()
    camera.getWorldDirection( lookAtTarget )
    lookAtTarget.y = 0
    lookAtTarget.normalize()
    const quaternion = new Quaternion().setFromUnitVectors( new Vector3( 0, 0, -1 ), lookAtTarget )
    ref.current.setRotation( quaternion, true )
  })
  

  return (
    <RigidBody
      ref={ ref }
      colliders="ball"
      lockRotations
      position={[ 0, 5, 0 ]}
      restitution={ 0.3 }
      linearDamping={ 0.5 }
      onCollisionEnter={() => setIsOn( true )}
      onIntersectionExit={() => setIsOn( false )}>
      <primitive object={ nodes.orb }/>
    </RigidBody>
  )
}