import { React, useLayoutEffect, useState, useRef } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

function ScreenshotViewer(props) {
	const [imgTop, setImgTop] = useState(0)
	const [imgLeft, setImgLeft] = useState(0)
	const img = useRef(null)

	function getOffset(el) {
		const rect = el.getBoundingClientRect()
		return {
			left: rect.left + window.scrollX,
			top: rect.top + window.scrollY,
		}
	}

	useLayoutEffect(() => {
		setImgTop(getOffset(img.current).top)
		setImgLeft(getOffset(img.current).left)
	})

	function updatePredictions() {
		props.model.detect(img.current).then(function (predictions) {
			// Lets write the predictions to a new paragraph element and
			// add it to the DOM.
			for (let n = 0; n < predictions.length; n++) {
				// Description text
				const p = document.createElement('p')
				p.innerText =
					predictions[n].class +
					' - with ' +
					Math.round(parseFloat(predictions[n].score) * 100) +
					'% confidence.'
				// Positioned at the top left of the bounding box.
				// Height is whatever the text takes up.
				// Width subtracts text padding in CSS so fits perfectly.
				p.style =
					'left: ' +
					(imgLeft + predictions[n].bbox[0]) +
					'px;' +
					'top: ' +
					(imgTop + predictions[n].bbox[1]) +
					'px; ' +
					'width: ' +
					(predictions[n].bbox[2] - 10) +
					'px;'

				const highlighter = document.createElement('div')
				highlighter.setAttribute('class', 'highlighter')
				highlighter.style =
					'left: ' +
					(imgLeft + predictions[n].bbox[0]) +
					'px;' +
					'top: ' +
					(imgTop + predictions[n].bbox[1]) +
					'px;' +
					'width: ' +
					predictions[n].bbox[2] +
					'px;' +
					'height: ' +
					predictions[n].bbox[3] +
					'px;'

				img.current.parentNode.appendChild(highlighter)
				img.current.parentNode.appendChild(p)
			}
		})
	}

	return (
		<div>
			<Row>
				<Col className='text-center classifyOnClick'>
					<h2>Screenshot object detection</h2>
					<Image
						src={props.screenshot}
						height={props.videoHeight}
						width={props.videoWidth}
						ref={img}
						onClick={updatePredictions}
						id='screenshot'
					/>
				</Col>
			</Row>
		</div>
	)
}

export default ScreenshotViewer
