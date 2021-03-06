import React, { useRef, useEffect } from 'react';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

import World from './services/threeJs'

import './App.scss'

function App() {
  const ref = useRef(null)
  const world = new World()

  useEffect(() => {
    ref.current.appendChild(world.getRenderDomElement())
    ref.current.appendChild( VRButton.createButton( world.getRenderer() ) );

    // eslint-disable-next-line
  }, [])

  return (
    <div ref={ref} className="render">
    </div>
  );
}

export default App;
