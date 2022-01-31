const Plane = (props) => {
  return (
    <mesh position={props.position} rotation={props.rotation} name="plane">
      <planeBufferGeometry attach="geometry" args={[200, 200]} />
      <meshStandardMaterial attach="material" color={props.colour} />
    </mesh>
  );
};

export default Plane;
