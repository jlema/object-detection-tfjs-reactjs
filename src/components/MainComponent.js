import { React, useState, useEffect, useRef, useCallback } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import WebcamViewer from './WebcamViewerComponent'
import ScreenshotViewer from './ScreenshotViewerComponent'
import useViewport from '../custom/useViewport'

function Main(props) {
	const [model, setModel] = useState()
	const [screenshot, setScreenshot] = useState()
	const webcamRef = useRef(null)
	const [videoWidth, setVideoWidth] = useState(640)
	const [videoHeight, setvideoHeight] = useState(480)
	const { width, height } = useViewport(() => {
		setVideoWidth(width / 2)
		setvideoHeight((videoWidth * 3) / 4)
	})

	useEffect(() => {
		async function loadModel() {
			await cocoSsd.load().then(loadedModel => setModel(loadedModel))
			console.log('coco-ssd model loaded!')
		}
		loadModel()
	}, [])

	const capture = useCallback(() => {
		setScreenshot(webcamRef.current.getScreenshot())
	}, [webcamRef])

	return (
		<Container fluid>
			<Row>
				<Col md={12} lg={6}>
					<WebcamViewer
						webcamRef={webcamRef}
						capture={capture}
						videoWidth={videoWidth}
						videoHeight={videoHeight}
						model={model}
					/>
				</Col>
				<Col md={12} lg={6}>
					<ScreenshotViewer
						screenshot={screenshot}
						videoWidth={videoWidth}
						videoHeight={videoHeight}
						model={model}
					/>
				</Col>
			</Row>
		</Container>
	)
}

export default Main
