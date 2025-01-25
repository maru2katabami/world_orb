import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

const { scene } = useGLTF("/mapping.glb")

export default function Mapping() {
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={ scene }/>
    </RigidBody>
  )
}