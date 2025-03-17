import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";

interface DieProps {
	value: number;
	position: [number, number, number];
	isRolling: boolean;
}
// Component to create an indented pip (the dots on a die face)
const Pip = ({ position }: { position: [number, number, number] }) => {
	// For indented pips, we'll use a cylinder with dark material
	// Note: We move the pip inward (negative z) to create an indent effect
	const [x, y, z] = position;
	const depthPosition: [number, number, number] = [x, y, z * -0.5]; // Invert the z position

	return (
		<mesh position={depthPosition} rotation={[Math.PI / 2, 0, 0]}>
			<cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
			<meshStandardMaterial color="#111" roughness={0.8} metalness={0.1} />
		</mesh>
	);
};

const DieFace = ({
	faceValue,
	position,
	rotation,
}: {
	faceValue: number;
	position: [number, number, number];
	rotation: [number, number, number];
}) => {
	// Define pip positions based on face value
	// For a unit cube centered at origin, each face is 0.5 units from center
	// We'll position pips slightly inset from the surface
	const pips = useMemo(() => {
		const pipPositions: Array<[number, number, number]> = [];
		const offset = 0.18; // Offset from center of face
		const depth = 0.01; // How deep to inset the pip

		// Determine which pips to show based on the face value
		switch (faceValue) {
			case 1:
				pipPositions.push([0, 0, depth]);
				break;
			case 2:
				pipPositions.push([offset, offset, depth], [-offset, -offset, depth]);
				break;
			case 3:
				pipPositions.push(
					[offset, offset, depth],
					[0, 0, depth],
					[-offset, -offset, depth]
				);
				break;
			case 4:
				pipPositions.push(
					[offset, offset, depth],
					[-offset, offset, depth],
					[offset, -offset, depth],
					[-offset, -offset, depth]
				);
				break;
			case 5:
				pipPositions.push(
					[offset, offset, depth],
					[-offset, offset, depth],
					[0, 0, depth],
					[offset, -offset, depth],
					[-offset, -offset, depth]
				);
				break;
			case 6:
				pipPositions.push(
					[offset, offset, depth],
					[-offset, offset, depth],
					[offset, 0, depth],
					[-offset, 0, depth],
					[offset, -offset, depth],
					[-offset, -offset, depth]
				);
				break;
			default:
				break;
		}
		return pipPositions;
	}, [faceValue]);

	return (
		<group position={position} rotation={rotation}>
			{/* Render each pip for this face */}
			{pips.map((pipPosition, index) => (
				<Pip key={index} position={pipPosition} />
			))}
		</group>
	);
};

export function Die({ value, position, isRolling }: DieProps) {
	const rigidBody = useRef<RapierRigidBody>(null);
	const [localValue, setLocalValue] = useState(value);
	const wasRolling = useRef(false);
	// Reference to track when the die has settled
	const isSettled = useRef(false);
	// Track last movement for settling detection
	const lastPosition = useRef(new THREE.Vector3());
	const lastRotation = useRef(new THREE.Quaternion());
	const settleThreshold = 0.001; // Threshold to consider the die settled

	useFrame(() => {
		if (!rigidBody.current) return;

		// Apply initial impulse when rolling starts
		if (isRolling && !wasRolling.current) {
			isSettled.current = false;

			// Apply random impulse and torque when rolling starts
			rigidBody.current.applyImpulse(
				{
					x: Math.random() * 2 - 1,
					y: 3 + Math.random(),
					z: Math.random() * 2 - 1,
				},
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
			// Debugging
			console.log("Rolling: ", rigidBody.current);
			// Get current position and rotation
			const currentPosition = rigidBody.current.translation();
			const currentRotation = rigidBody.current.rotation();

			// Convert to Three.js objects for easier calculations
			const posVec = new THREE.Vector3(
				currentPosition.x,
				currentPosition.y,
				currentPosition.z
			);
			const rotQuat = new THREE.Quaternion(
				currentRotation.x,
				currentRotation.y,
				currentRotation.z,
				currentRotation.w
			);

			// Check if the die has settled
			const positionDelta = posVec.distanceTo(lastPosition.current);
			const rotationDelta = 1 - lastRotation.current.dot(rotQuat);

			if (positionDelta < settleThreshold && rotationDelta < settleThreshold) {
				if (!isSettled.current) {
					isSettled.current = true;
					determineUpFace(rotQuat);
				}
			} else {
				isSettled.current = false;
			}

			// Update last position and rotation
			lastPosition.current.copy(posVec);
			lastRotation.current.copy(rotQuat);
		}

		wasRolling.current = isRolling;
	});

	// Determine which face is pointing up
	const determineUpFace = (rotation: THREE.Quaternion) => {
		// Create a vector pointing up
		const upVector = new THREE.Vector3(0, 1, 0);

		// Create vectors for each face direction
		const directions = [
			new THREE.Vector3(1, 0, 0), // +X (right) - face 6
			new THREE.Vector3(-1, 0, 0), // -X (left) - face 1
			new THREE.Vector3(0, 1, 0), // +Y (up) - face 5
			new THREE.Vector3(0, -1, 0), // -Y (down) - face 2
			new THREE.Vector3(0, 0, 1), // +Z (front) - face 3
			new THREE.Vector3(0, 0, -1), // -Z (back) - face 4
		];

		// Apply the die's rotation to each direction
		const rotMatrix = new THREE.Matrix4().makeRotationFromQuaternion(rotation);

		// Find which face is most aligned with the up vector
		let maxDot = -Infinity;
		let upFaceIndex = 0;

		directions.forEach((dir, index) => {
			dir.applyMatrix4(rotMatrix);
			const dot = dir.dot(upVector);

			if (dot > maxDot) {
				maxDot = dot;
				upFaceIndex = index;
			}
		});

		// Map face index to die value (following standard die where opposite faces sum to 7)
		const faceValues = [6, 1, 5, 2, 3, 4];
		setLocalValue(faceValues[upFaceIndex]);
	};

	return (
		<RigidBody
			ref={rigidBody}
			position={position}
			colliders="cuboid"
			restitution={0.7}
			friction={0.5}
		>
			<group>
				<mesh castShadow receiveShadow>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial color="white" />
				</mesh>

				<DieFace faceValue={1} position={[0, 0, 0.5]} rotation={[0, 0, 0]} />
				<DieFace
					faceValue={6}
					position={[0, 0, -0.5]}
					rotation={[0, Math.PI, 0]}
				/>
				<DieFace
					faceValue={2}
					position={[0, 0.5, 0]}
					rotation={[Math.PI / 2, 0, 0]}
				/>
				<DieFace
					faceValue={5}
					position={[0, -0.5, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
				/>
				<DieFace
					faceValue={3}
					position={[0.5, 0, 0]}
					rotation={[0, Math.PI / 2, 0]}
				/>
				<DieFace
					faceValue={4}
					position={[-0.5, 0, 0]}
					rotation={[0, -Math.PI / 2, 0]}
				/>
			</group>
		</RigidBody>
	);
}
