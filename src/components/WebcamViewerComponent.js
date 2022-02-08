import { React, useState, useEffect, useRef } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Webcam from 'react-webcam'

function WebcamViewer(props) {
	const [facingMode, setFacingMode] = useState('environment')

	const videoConstraints = {
		width: props.videoWidth,
		height: props.videoHeight,
		facingMode: facingMode,
	}

	let children = []
	const liveView = useRef(null)

	function startPredictions() {
		predictWebcam()
		props.capture()
	}

	function predictWebcam() {
		// Now let's start classifying the stream.
		props.model
			.detect(props.webcamRef.current.video)
			.then(function (predictions) {
				// Remove any highlighting we did previous frame.
				for (let i = 0; i < children.length; i++) {
					liveView.current.removeChild(children[i])
				}
				children.splice(0)

				// Now lets loop through predictions and draw them to the live view if
				// they have a high confidence score.
				for (let n = 0; n < predictions.length; n++) {
					// If we are over 66% sure we are sure we classified it right, draw it!
					if (predictions[n].score > 0.66) {
						const p = document.createElement('p')
						p.innerText =
							predictions[n].class +
							' - with ' +
							Math.round(parseFloat(predictions[n].score) * 100) +
							'% confidence.'
						// Draw in top left of bounding box outline.
						p.style =
							'left: ' +
							predictions[n].bbox[0] +
							'px;' +
							'top: ' +
							predictions[n].bbox[1] +
							'px;' +
							'width: ' +
							(predictions[n].bbox[2] - 10) +
							'px;'

						// Draw the actual bounding box.
						const highlighter = document.createElement('div')
						highlighter.setAttribute('class', 'highlighter')
						highlighter.style =
							'left: ' +
							predictions[n].bbox[0] +
							'px; top: ' +
							predictions[n].bbox[1] +
							'px; width: ' +
							predictions[n].bbox[2] +
							'px; height: ' +
							predictions[n].bbox[3] +
							'px;'

						liveView.current.appendChild(highlighter)
						liveView.current.appendChild(p)

						// Store drawn objects in memory so we can delete them next time around.
						children.push(highlighter)
						children.push(p)
					}
				}

				// Call this function again to keep predicting when the browser is ready.
				window.requestAnimationFrame(predictWebcam)
			})
	}

	return (
		<div id='liveView' className='videoView' ref={liveView}>
			<Row>
				<Col className='text-center'>
					<h2>Webcam continuous object detection</h2>
					<Webcam
						audio={false}
						height={props.videoHeight}
						ref={props.webcamRef}
						screenshotFormat='image/jpeg'
						width={props.videoWidth}
						videoConstraints={videoConstraints}
						id='webcam'
					/>
				</Col>
			</Row>
			<Row>
				<Col className='text-center'>
					<Button id='webcambutton' onClick={startPredictions}>
						Start detection
					</Button>
				</Col>
			</Row>
		</div>
	)
}

export default WebcamViewer
