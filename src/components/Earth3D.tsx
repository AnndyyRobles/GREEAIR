// import React, { useEffect, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Sphere } from "@react-three/drei";
// import axios from "axios";
// import * as THREE from "three";

// interface Station {
//   nombre: string;
//   latitud: number;
//   longitud: number;
// }

// const Earth3D: React.FC = () => {
//   const [stations, setStations] = useState<Station[]>([]);

//   // Cargar las estaciones meteorológicas desde la API
//   useEffect(() => {
//     axios.get<Station[]>("/api/stations/coordinates").then((response) => {
//       setStations(response.data);
//     });
//   }, []);

//   // Función para convertir latitud y longitud en posiciones 3D
//   const convertLatLonToPosition = (lat: number, lon: number, radius: number) => {
//     const phi = (90 - lat) * (Math.PI / 180); // Convertir latitud a radianes
//     const theta = (lon + 180) * (Math.PI / 180); // Convertir longitud a radianes

//     return {
//       x: -(radius * Math.sin(phi) * Math.cos(theta)),
//       y: radius * Math.cos(phi),
//       z: radius * Math.sin(phi) * Math.sin(theta),
//     };
//   };

//   return (
//     <div style={{ width: "100%", height: "600px", position: "relative", overflow: "hidden" }}>
//       <Canvas>
//         {/* Iluminación */}
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[10, 10, 10]} intensity={1.2} />

//         {/* Esfera de la Tierra */}
//         <Sphere args={[1, 64, 64]} scale={2.5} position={[0, 0, 0]}>
//           <meshStandardMaterial
//             map={new THREE.TextureLoader().load("/earth3d-texture-color.jpg")} // Ruta a la textura
//           />
//         </Sphere>

//         {/* Indicadores de estaciones */}
//         {stations.map((station, index) => {
//           const position = convertLatLonToPosition(
//             station.latitud,
//             station.longitud,
//             2.5 // Ajustado al tamaño del planeta
//           );
//           return (
//             <group key={index} position={[position.x, position.y, position.z]}>
//               {/* Base del marcador (cono) */}
//               <mesh rotation={[-Math.PI / 2, 0, 0]}> {/* Cono apuntando hacia el globo */}
//                 <coneGeometry args={[0.05, 0.15, 8]} />
//                 <meshStandardMaterial color="red" />
//               </mesh>

//               {/* Cabeza del marcador (esfera) */}
//               <mesh position={[0, 0.1, 0]}>
//                 <sphereGeometry args={[0.05, 16, 16]} />
//                 <meshStandardMaterial color="red" />
//               </mesh>
//             </group>
//           );
//         })}

//         {/* Controles de cámara */}
//         <OrbitControls enableZoom={true} />
//       </Canvas>
//     </div>
//   );
// };

// export default Earth3D;
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import axios from "axios";
import * as THREE from "three";

interface Station {
  nombre: string;
  latitud: number;
  longitud: number;
}

const Earth3D: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);

  // Cargar las estaciones meteorológicas desde la API
  useEffect(() => {
    axios.get<Station[]>("/api/stations/coordinates").then((response) => {
      setStations(response.data);
    });
  }, []);

  // Función para convertir latitud y longitud en posiciones 3D
  const convertLatLonToPosition = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180); // Convertir latitud a radianes
    const theta = (lon + 180) * (Math.PI / 180); // Convertir longitud a radianes

    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta),
    };
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <Canvas>
        {/* Iluminación */}
        <ambientLight intensity={0.8} color="white" /> {/* Luz ambiental general */}
        <directionalLight
          position={[10, 15, 10]}
          intensity={2}
          castShadow
          color="white"
        /> {/* Luz principal */}
        <pointLight position={[10, -10, 10]} intensity={1.5} color="white" /> {/* Luz inferior derecha */}
        <pointLight position={[-10, 10, -10]} intensity={1.5} color="white" /> {/* Luz superior izquierda */}
        <hemisphereLight skyColor={"white"} groundColor={"gray"} intensity={0.9} /> {/* Luz cielo y suelo */}

        {/* Esfera de la Tierra */}
        <Sphere args={[1, 64, 64]} scale={2.5} position={[0, 0, 0]}>
          <meshStandardMaterial
            map={new THREE.TextureLoader().load("/earth3d-texture-color.jpg")}
            roughness={0.5} // Reduce rugosidad para mayor brillo
            metalness={0.3} // Simula un efecto metálico para reflejar mejor la luz
          />
        </Sphere>

        {/* Indicadores de estaciones */}
        {stations.map((station, index) => {
          const position = convertLatLonToPosition(
            station.latitud,
            station.longitud,
            2.5 // Ajustado al tamaño del planeta
          );
          return (
            <group key={index} position={[position.x, position.y, position.z]}>
              {/* Base del marcador (cono) */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.05, 0.15, 8]} />
                <meshStandardMaterial color="red" />
              </mesh>

              {/* Cabeza del marcador (esfera) */}
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color="red" />
              </mesh>
            </group>
          );
        })}

        {/* Controles de cámara */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default Earth3D;

