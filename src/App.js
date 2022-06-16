import {useRef, useEffect} from 'react';
import './App.css';


// import the face landmark models
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';

// get the connection to webcam
import Webcam from 'react-webcam';



import {drawMesh, drawPath } from './drawing_utilities';

function App() {
  const cameraRef = useRef(null)
  const canvasRef = useRef(null)

  // load facemesh model
  const runFacemesh = async () => {
    const net = await facemesh.load({
      imputResolution: {width: 640, height: 480},
      scale: 0.8
    })

    setInterval(() => {
      detect(net)
    }, 100)
  } 


  // detect facemesh
  const detect = async (net) => {
    if (typeof cameraRef.current !== 'undefined' && 
        cameraRef.current !== null &&
        cameraRef.current.video.readyState === 4
        ){
        // get video properties 
        const video = cameraRef.current.video;
        const videoHeight = cameraRef.current.video.videoHeight
        const videoWidth = cameraRef.current.video.videoWidth

        // set video width 
        video.width = videoWidth;
        video.height = videoHeight;

        // set canva width 
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // make detections 
        const face = await net.estimateFaces(video);
        // console.log(face[0].scaledMesh);

        // Get canvas context for drawing
        const ctx = canvasRef.current.getContext("2d")
        drawMesh(face, ctx)
    }
  }


  useEffect(() => {
    runFacemesh()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
          
        <Webcam 
          ref={cameraRef} 
          style={
              {
                position: 'absolute',
                // top: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                left: 0,
                right: 0,
                textAlign: 'center',
                width: 640,
                height: 480,
                zIndex: 9,
              }
            }
          />
          <canvas ref={canvasRef} 
            style={
              {
                position: 'absolute',
                // top: 200,
                marginLeft: 'auto',
                marginRight: 'auto',
                left: 0,
                right: 0,
                textAlign: 'center',
                width: 640,
                height: 480,
                zIndex: 9

              }
            } 
          />
          <h3 className="text">Face Mesh App</h3>
      </header>

    </div>
  );
}

export default App;
