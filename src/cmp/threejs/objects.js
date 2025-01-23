import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export const Objects = () => {
  const { nodes } = useGLTF("/objects.glb");

  const map = []

  const hexTiles = ( rows, cols ) => {
    const tileWidth = 1.732
    const tileHeight = 2
    const yOffset = tileHeight * 0.76
    for ( let i = 0; i < rows; i++ ) {
      for ( let j = 0; j < cols; j++ ) {
        const x = j * tileWidth + ( i % 2 === 1 ? tileWidth / 2 : 0 )
        const z = i * yOffset + 1
        map.push({ type: "hexagon", position: [ x, 0, z ], rotation: [0, 0, 0]})
      }
    }
  }
  
  hexTiles( 25, 25 )

  return (
    map.map(({ type, position, rotation }, index) => (
      <RigidBody
        key={index}
        type="fixed"
        colliders="hull"
        position={position}
        rotation={rotation}
        restitution={0.3}
      >
        <primitive object={nodes[type].clone()} />
      </RigidBody>
    ))
  );
};
