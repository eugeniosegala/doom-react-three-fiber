import { usePlane } from "@react-three/cannon";

const Plane = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh
      position={props.position}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={ref}
      name="plane"
    >
      <planeBufferGeometry attach="geometry" args={[200, 200]} />
      <meshStandardMaterial attach="material" color={props.colour} />
    </mesh>
  );
};

export default Plane;
