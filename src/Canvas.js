import React, { Component } from "react";
import fingerprint from './assets/Fingerprint.jpg';
import { Stage, Layer, Arrow, Image } from "react-konva";
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';

class Drawable {
	constructor(startx, starty) {
		this.startx = startx;
		this.starty = starty;
	}
}

class ArrowDrawableBlack extends Drawable {
	constructor(startx, starty, scaling) {
		super(startx, starty);
		this.x = startx;
		this.y = starty;
		this.scaling = scaling;
		this.color = "black";
	}
	registerMovement(x, y) {
		let maxDist = 25 * this.scaling
		let xDist = x - this.startx;
		let yDist = y - this.starty;
		const vLength = Math.sqrt(xDist * xDist + yDist * yDist)
		if (vLength <= maxDist) {
			this.x = x;
			this.y = y;
		} else {
			const norm = (1 / vLength) * maxDist
			this.x = this.startx + norm * xDist
			this.y = this.starty + norm * yDist
		}
	}
	render(index) {
		const points = [this.startx, this.starty, this.x, this.y];
		return <Arrow key={index} pointerLength={10 * this.scaling / 1.2} pointerWidth={10 * this.scaling / 1.2} strokeWidth={2 * this.scaling} points={points} fill="black" stroke="black" />;
	}
}

class ArrowDrawableWhite extends Drawable {
	constructor(startx, starty, scaling) {
		super(startx, starty);
		this.x = startx;
		this.y = starty;
		this.scaling = scaling;
		this.color = "white";
	}
	registerMovement(x, y) {
		let maxDist = 25 * this.scaling
		let xDist = x - this.startx;
		let yDist = y - this.starty;
		const vLength = Math.sqrt(xDist * xDist + yDist * yDist)
		if (vLength <= maxDist) {
			this.x = x;
			this.y = y;
		} else {
			const norm = (1 / vLength) * maxDist
			this.x = this.startx + norm * xDist
			this.y = this.starty + norm * yDist
		}
	}
	render(index) {
		const points = [this.startx, this.starty, this.x, this.y];
		return <Arrow key={index} pointerLength={10 * this.scaling / 1.2} pointerWidth={10 * this.scaling / 1.2} strokeWidth={2 * this.scaling} points={points} fill="white" stroke="white" />;
	}
}

class BackgroundImage extends React.Component {
	state = {
		image: null,
		src: null,
		scaling: 1
	};

	componentDidUpdate(nextProps) {
		if (nextProps.scaling !== this.state.scaling || this.state.image.width === 0) {
			const image = new window.Image();
			image.src = `${this.props.src}`;
			image.height = (image.height * (140 / image.width)) * nextProps.scaling
			image.width = 140 * nextProps.scaling
			image.onload = () => {
				this.setState({
					image: image,
					src: nextProps.src,
					scaling: nextProps.scaling
				});
				this.props.handleSize(image.width, image.height)
			};
		}
		if (nextProps.src !== this.state.src) {
			const image = new window.Image();
			image.src = `${nextProps.src}`;
			image.height = (image.height * (140 / image.width)) * nextProps.scaling
			image.width = 140 * nextProps.scaling
			image.onload = () => {
				this.setState({
					image: image,
					src: nextProps.src,
					scaling: nextProps.scaling
				});
				this.props.handleSize(image.width, image.height)
			};
		}
	}

	componentDidMount() {
		const image = new window.Image();
		image.src = `${this.props.src}`;
		image.height = (image.height * (140 / image.width)) * this.state.scaling
		image.width = 140 * this.state.scaling
		image.onload = () => {
			this.setState({
				image: image
			});
			this.props.handleSize(image.width, image.height)
		};
	}

	render() {
		return <Image image={this.state.image} />;
	}
}

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drawables: [],
			newDrawable: [],
			newDrawableType: "ArrowDrawableBlack",
			background: fingerprint,
			scaling: 1,
			scalingPoints: 1,
			previousWith: null,
			previousHeight: null,
			width: 0,
			height: 0
		};
		this.canvas = React.createRef();
	}

	componentDidUpdate(nextProps) {
		if (nextProps.arrowList !== this.state.drawables) {
			this.setState({
				drawables: nextProps.arrowList
			});
			this.handleExport()
		}
		if (nextProps.background !== this.state.background) {
			this.setState({
				background: nextProps.background
			});
		}
	}

	handleSize = (newWidth, newHeight) => {
		if (this.state.previousWith == null || this.state.previousWith <= 0) {
			this.setState({
				previousWith: newWidth,
				previousHeight: newHeight,
				width: newWidth,
				height: newHeight,
			})
			return
		} else {
			let newScaling = newWidth / this.state.previousWith
			this.setState({
				previousWith: newWidth,
				previousHeight: newHeight,
				width: newWidth,
				height: newHeight,
				scalingPoints: newScaling
			})
			var newDrawables = []
			for (let i = 0; i < this.state.drawables.length; i++) {
				newDrawables[i] = this.state.drawables[i]
				newDrawables[i].scaling = this.state.scaling
				newDrawables[i].startx = this.state.drawables[i].startx * newScaling
				newDrawables[i].starty = this.state.drawables[i].starty * newScaling
				newDrawables[i].x = this.state.drawables[i].x * newScaling
				newDrawables[i].y = this.state.drawables[i].y * newScaling
			}
			this.setState({
				drawables: newDrawables,
			})
			this.onChangeDrawables(newDrawables)
		}
	}

	onChangeDrawables = (drawables) => {
		this.props.onChange(drawables)
	}

	getNewDrawableBasedOnType = (x, y, type) => {
		const drawableClasses = {
			ArrowDrawableBlack,
			ArrowDrawableWhite
		};
		return new drawableClasses[type](x, y, this.state.scaling);
	};

	handleMouseDown = e => {
		const { newDrawable } = this.state;
		if (newDrawable.length === 0) {
			const { x, y } = e.target.getStage().getPointerPosition();
			const newDrawable = this.getNewDrawableBasedOnType(
				x,
				y,
				this.state.newDrawableType
			);
			this.setState({
				newDrawable: [newDrawable]
			});
		}
	};

	handleMouseUp = e => {
		const { newDrawable, drawables } = this.state;
		if (newDrawable.length === 1) {
			const { x, y } = e.target.getStage().getPointerPosition();
			const drawableToAdd = newDrawable[0];
			drawableToAdd.registerMovement(x, y);
			drawables.push(drawableToAdd);
			this.setState({
				newDrawable: [],
				drawables
			});
			this.onChangeDrawables(drawables)
		}
	};

	handleMouseMove = e => {
		const { newDrawable } = this.state;
		if (newDrawable.length === 1) {
			const { x, y } = e.target.getStage().getPointerPosition();
			const updatedNewDrawable = newDrawable[0];
			updatedNewDrawable.registerMovement(x, y);
			this.setState({
				newDrawable: [updatedNewDrawable]
			});
		}
	};

	handleChangeVariant = (event) => {
		this.setState({ newDrawableType: event.target.value })
	};

	changeScaling = (event) => {
		this.setState({
			scaling: event.target.value
		})
	}

	onChangeFile(event) {
		event.stopPropagation();
		event.preventDefault();
		var file = event.target.files[0];
		file = URL.createObjectURL(file);
		this.props.changeFile(file)
		this.setState({
			background: file
		})
	}

	handleExport = () => {
		if (this.canvas.current.attrs.width >= 0 && this.canvas.current.attrs.height && this.canvas.current.children[0].children[0]) {
			this.canvas.current.children[0].children[0].visible(false)
			const uri = this.canvas.current.children[0].toDataURL()
			this.canvas.current.children[0].children[0].visible(true)
			this.props.getArrowsImage(uri)
		}
	};

	render() {
		const drawables = [...this.state.drawables, ...this.state.newDrawable];
		return (
			<div>
				<RadioGroup
					defaultValue="StyleGAN"
					name="variant-group"
					value={this.state.newDrawableType}
					onChange={this.handleChangeVariant}
				>
					<Stack direction="row" spacing={2} sx={{ ml: 1 }}>
						<FormControlLabel value="ArrowDrawableBlack" control={<Radio />} label="Schwarze Minuzie" />
						<FormControlLabel value="ArrowDrawableWhite" control={<Radio />} label="Weiße Minuzie" />
						<Button onClick={() => this.upload.click()} startIcon={<FileUploadIcon />} variant="contained">
							Vorlage
						</Button>
						<input id="myInput"
							type="file"
							ref={(ref) => this.upload = ref}
							style={{ display: 'none' }}
							onChange={this.onChangeFile.bind(this)}
						/>

					</Stack>
					<Stack direction="row" sx={{ alignItems: "center", ml: 2, mt: 2, mb: 2 }}>
						<Typography variant="body">
							Skalierung:
						</Typography>
						<Slider
							sx={{ width: "30%", ml: 3 }}
							defaultValue={1}
							getAriaValueText={() => `${this.state.scaling}`}
							valueLabelDisplay="auto"
							step={0.2}
							marks
							min={1}
							max={3}
							onChange={this.changeScaling}
						/>
					</Stack>
				</RadioGroup>
				<Stage
					onMouseDown={this.handleMouseDown}
					onMouseUp={this.handleMouseUp}
					onMouseMove={this.handleMouseMove}
					width={this.state.width}
					height={this.state.height}
					ref={this.canvas}
				>
					<Layer>
						<BackgroundImage src={this.state.background} scaling={this.state.scaling} handleSize={this.handleSize} />
						{drawables.map((drawable, index) => {
							return drawable.render(index);
						})}
					</Layer>
				</Stage>
			</div >
		);
	}
}

export default Canvas;