import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

interface DieProps {
	value: number;
	position: [number, number, number];
	isRolling: boolean;
}

export function Die({ value, position, isRolling }: DieProps) {
	const rigidBody = useRef<RigidBody>(null);
	const [localValue, setLocalValue] = useState(value);
	const wasRolling = useRef(false);

	useFrame(() => {
		if (rigidBody.current) {
			if (isRolling && !wasRolling.current) {
				// Apply random impulse and torque when rolling starts
				rigidBody.current.applyImpulse(
					{ x: Math.random() * 2 - 1, y: 3, z: Math.random() * 2 - 1 },
					true
				);
				rigidBody.current.applyTorqueImpulse(
					{
						x: Math.random() * 10 - 5,
						y: Math.random() * 10 - 5,
						z: Math.random() * 10 - 5,
					},
					true
				);
			}

			if (isRolling) {
				const rotation = rigidBody.current.rotation();
				// Convert rotation to Euler angles
				const euler = new THREE.Euler().setFromQuaternion(
					new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
				);

				// Determine upward face based on rotation
				// This is still simplified - you might want to add thresholds
				const x = Math.round(euler.x / (Math.PI / 2));
				const y = Math.round(euler.y / (Math.PI / 2));
				const z = Math.round(euler.z / (Math.PI / 2));

				const newValue = ((x + y + z) % 6) + 1;
				setLocalValue(newValue);
			}

			wasRolling.current = isRolling;
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
