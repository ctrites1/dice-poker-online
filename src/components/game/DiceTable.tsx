import { RigidBody } from '@react-three/rapier';

export function DiceTable() {
  return (
    <RigidBody type="fixed" position={[0, 0, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a472a" />
      </mesh>
      {/* Add walls */}
      <mesh position={[10, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial color="#2d5a3c" />
      </mesh>
      <mesh position={[-10, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial color="#2d5a3c" />
      </mesh>
      <mesh position={[0, 1, 10]}>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial color="#2d5a3c" />
      </mesh>
      <mesh position={[0, 1, -10]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial color="#2d5a3c" />
      </mesh>
    </RigidBody>
  );
}