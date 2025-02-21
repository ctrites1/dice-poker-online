import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import type { RigidBody as RigidBodyType } from '@react-three/rapier';
import * as THREE from 'three';

interface DieProps {
  value: number;
  position: [number, number, number];
  isRolling: boolean;
}

export function Die({ value, position, isRolling }: DieProps) {
  const rigidBody = useRef<RigidBodyType>(null);
  const [localValue, setLocalValue] = useState(value);
  
  useFrame(() => {
    if (rigidBody.current && isRolling) {
      const rotation = rigidBody.current.rotation();
      // Calculate the face that's pointing up based on rotation
      // This is a simplified version - you'll need more complex logic
      // to accurately determine the upward face
      const newValue = Math.floor(Math.random() * 6) + 1;
      setLocalValue(newValue);
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      position={position}
      colliders="cuboid"
      restitution={0.7}
      friction={0.5}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
        {/* Add pip geometries for each face */}
      </mesh>
    </RigidBody>
  );
}