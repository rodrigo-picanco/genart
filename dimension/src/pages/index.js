import React, { useRef, useState } from "react"
import { a, useSpring } from "react-spring/three"
import { Canvas, extend, useFrame, useThree } from "react-three-fiber"
import { createGlobalStyle } from "styled-components"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as THREE from "three"
import * as R from "ramda"

extend({ OrbitControls })

const GlobalStyles = createGlobalStyle`
  body, #___gatsby, #gatsby-focus-wrapper {
    margin: 0;
    height: 100vh;
    width: 100vw;
    font-family: monospace;
  }
`

const Controls = () => {
  const { camera, gl } = useThree()
  const orbitRef = useRef()

  useFrame(() => {
    orbitRef.current.update()
  })

  const divideByThree = R.divide(3)
  const PIByThree = divideByThree(Math.PI)

  return (
    <orbitControls
      autoRotate
      maxPolarAngle={PIByThree}
      minPolarAngle={PIByThree}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

const Box = () => {
  const toggle = R.curry((fn, state, value) => () => fn(value || !state))
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)

  const toggleActive = toggle(setActive, active, null)
  const toggleHover = toggle(setHovered, hovered)
  const hover = toggleHover(true)
  const unhover = toggleHover(false)

  const scale = active ? R.repeat(1.5, 3) : R.repeat(1, 3)
  const color = hovered ? "hotpink" : "gray"

  const props = useSpring({
    scale,
    color,
  })

  return (
    <a.mesh
      scale={props.scale}
      onPointerOver={hover}
      onPointerOut={unhover}
      onClick={toggleActive}
      castShadow
    >
      <ambientLight penumbra={1} castShadow />
      <spotLight penumbra={1} position={[0, 5, 10]} castShadow />
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <a.meshPhysicalMaterial attach="material" color={props.color} />
    </a.mesh>
  )
}

const Plane = ({}) => {
  return (
    <mesh
      receiveShadow
      rotation={R.prepend(-Math.PI / 2, R.repeat(0, 2))}
      position={[0, -0.5, 0]}
    >
      <planeBufferGeometry attach="geometry" args={R.repeat(100, 2)} />
      <meshPhysicalMaterial attach="material" color="gray" />
    </mesh>
  )
}

export default () => (
  <>
    <GlobalStyles />
    <p style={{ marginLeft: 8 }}>
      shout out to jjkostick for the 3D model.
      <a href={"https://sketchfab.com/jjkostick"}> Checkout his/hers work.</a>
    </p>
    <Canvas
      camera={{ position: [0, 0, 5] }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      <fog attach="fog" args={["white", 5, 15]} />
      <Controls />
      <Box />
      <Plane />
    </Canvas>
  </>
)
