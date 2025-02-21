import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { DiceTable } from './DiceTable';
import { Die } from './Die';
import { useGameStore } from '../../store/gameStore';

export function DiceScene() {
  const { currentPlayer, isRolling } = useGameStore();
  
  return (
    <div className="w-full h-[600px] bg-black rounded-lg overflow-hidden">
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <Physics gravity={[0, -9.81, 0]}>
            <DiceTable />
            {currentPlayer?.hand?.map((value, index) => (
              <Die 
                key={index} 
                value={value} 
                position={[index - 2, 5, 0]}
                isRolling={isRolling}
              />
            ))}
          </Physics>
          
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}