import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";


export default function Mapping() {
  const { scene } = useGLTF("/mapping.glb")
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={ scene }/>
    </RigidBody>
  )
}