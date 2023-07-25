import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';       // react에서 three.js를 간편하게 활용할 수 있도록 하는 라이브러리
import { OrbitControls, PerspectiveCamera, Stars, useGLTF, Environment   } from "@react-three/drei";

interface ModelProps {
	url: string;
}

function Model({ url }: ModelProps) {
	// useGLTF 훅을 통해 glTF 형식의 3D 모델을 불러옴
	const gltf = useGLTF(url);
	return <primitive object={gltf.scene} 
	scale={[0.3, 0.3, 0.3]}   // 0.5배로 크기를 확대, 원하는 크기로 조절할 수 있습니다.
	position={[0, 0, 0]} // 위치 이동, x(좌우), y(위아래), z(앞뒤) 순서.
	/>;
}

export default function Three(): JSX.Element {
	return (
		// Canvas는 react-three/fiber Scene을 정의하기 시작하는 곳
		<Canvas style={{ height: '100%', backgroundColor: '#0f1325' }}>
			{/* 3D 공간에서 카메라의 위치와 시야각(FOV)을 설정 */}
			<PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
			{/* 주변 광원 설정 */}
			<ambientLight intensity={0.5} />
			{/* 한 지점에서 모든 방향으로 빛을 발산하는 점 광원을 설정 */}
			<pointLight position={[10, 10, 10]} />
			{/* 로드 중인 컴포넌트를 렌더링하기 전에 다른 컴포넌틀르 보여줄 수 있게 해줌 */}
			{/* 여기서는 3D 모델이 로드되는 동안 아무것도 표시하지 않음 */}
			<Suspense fallback={null}>
				{/* 로드할 3D 모델 정의 */}
				<Model url="/assets/images/planet_earth.glb" />
			</Suspense>
			<OrbitControls
				// 3D 모델 자동 회전
				autoRotate
				// 3D 모델의 자동 회전 속도 설정
				autoRotateSpeed={1}
				// 패닝 기능 비활성화
				enablePan={false}
				// 줌 기능 비활성화
				enableZoom={false}
				// 카메라가 어느 정도까지 위로 올라갈 수 있는지 설정 (위 아래 이동 제한)
				maxPolarAngle={Math.PI / 5}
				// 카메라가 어느 정도까지 아래로 내려갈 수 있는지 설정 (위 아래 이동 제한)
				minPolarAngle={Math.PI / 2}
			/>
			<Stars radius={500} depth={50} count={7000} factor={10} />
			{/* <Environment preset="night" background /> */}
		</Canvas>
	);
}
