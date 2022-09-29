import './App.css';
import * as React from 'react';
import Canvas from './Canvas';

import amsl_logo from './assets/amsl_logo.png';
import fingerprint from './assets/Fingerprint.jpg';

import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import Fingerprint from '@mui/icons-material/Fingerprint';

import CircularProgress from '@mui/material/CircularProgress';

const fabGreenStyle = {
	color: 'common.white',
	bgcolor: green[500],
	'&:hover': {
		bgcolor: green[600],
	},
	position: 'absolute',
	bottom: 20,
	right: 15,
};

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'left',
	color: theme.palette.text.secondary,
}));

function makeSeed() {
	var length = 1 + (Math.random() * (100 - 1))
	var result = '';
	var characters = '0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return result;
}

export default function App() {
	const [variant, setVariant] = React.useState('StyleGAN');
	const [styleganSeed, setStyleganSeed] = React.useState(makeSeed());
	const [open, setOpen] = React.useState(false);
	const [arrowList, setArrowList] = React.useState([]);
	const [resultImage, setResultImage] = React.useState(null);
	const [gpu, setGpu] = React.useState(0);
	const [backgroundFile, setBackgroundFile] = React.useState(fingerprint);

	const handleChangeVariant = (event) => {
		setVariant(event.target.value);
	};

	const handleChangeGpu = (event) => {
		setGpu(event.target.value);
	};

	const handleChangeStyleganSeed = (event) => {
		let inputValue = event.target.value.replace(/\D/g, '')
		setStyleganSeed(inputValue);
	}

	const randomStyleganSeed = () => {
		setStyleganSeed(makeSeed());
	}

	const handleOpen = () => {
		setOpen(true);
		setTimeout((() => {
			fetch('http://localhost:7777/pix2pix')
				.then(response => response.blob())
				.then(imageBlob => setResultImage(URL.createObjectURL(imageBlob)));
		}), 2000)

	}

	const handleClose = () => {
		setOpen(false);
		setTimeout((() => {
			setResultImage(null);
		}), 200)

	}

	const handleDownload = () => {
		const link = document.createElement("a");
		link.href = resultImage;
		link.setAttribute("download", "fingerabdruck.png");
		document.body.appendChild(link);
		link.click();
		setOpen(false);
	}

	const newArrow = (list) => {
		setArrowList([...list]);
	}

	const changeFile = (file) => {
		setBackgroundFile(file);
	}

	const delFunction = (index) => {
		var newArrowList = arrowList;
		newArrowList.splice(index, 1);
		setArrowList([...newArrowList])
	}

	const makeList = (list) => {
		return (
			<List >
				{list.map((item, index) => (
					<ListItem
						key={index}
						secondaryAction={
							<IconButton onClick={() => delFunction(index)} edge="end" aria-label="delete">
								<DeleteIcon />
							</IconButton>
						}
					>
						<ListItemAvatar>
							<ArrowRightAltIcon />
						</ListItemAvatar>
						<ListItemText
							primary={`${index + 1}. Minutie`}
							secondary={`Farbe: ${item.color === "white" ? "Weiß" : "Schwarz"} | Start(x/y): ${Math.round(item.startx)}/${Math.round(item.starty)} | Spitze(x/y): ${Math.round(item.x)}/${Math.round(item.y)}`}
						/>
					</ListItem>))
				}
			</List>
		)
	}

	return (
		<React.Fragment>
			<AppBar sx={{ backgroundColor: 'white' }} position="static">
				<Container>
					<Toolbar disableGutters>
						<img src={amsl_logo} alt="logo" />
					</Toolbar>
				</Container>
			</AppBar>
			<Container sx={{ height: "100%", width: "100vw" }} >


				<Box sx={{ flexGrow: 1, mt: 2 }}>
					<Grid container spacing={2}>
						<Grid xs={6} md={12}>
							<Item>
								<Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
									Auswahl der Variante: {variant}
								</Typography>
								<Typography variant="body1" gutterBottom sx={{ marginBottom: 2, marginTop: 2 }}>
									Bitte wähle zunächst eine Variante zur Generierung des Fingerabdrucks aus. Die ausgewählte Variante hat Einfluss auf die zur Verfügung stehenden Parameter und den daraus resultierenden Fingerabdrücken.
								</Typography>
								<FormControl>
									<FormLabel id="variant-label">Variante</FormLabel>
									<RadioGroup
										defaultValue="StyleGAN"
										name="variant-group"
										value={variant}
										onChange={handleChangeVariant}
									>
										<FormControlLabel value="StyleGAN" control={<Radio />} label="StyleGAN" />
										<FormControlLabel value="StyleGAN2" control={<Radio />} label="StyleGAN2" />
										<FormControlLabel value="Pix2Pix" control={<Radio />} label="Pix2Pix" />
									</RadioGroup>
								</FormControl>
							</Item>
						</Grid>
						<Grid xs={6} md={12}>
							<Item>
								<Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
									Auswahl der GPU: {gpu}
								</Typography>
								<Typography variant="body1" gutterBottom sx={{ marginBottom: 2, marginTop: 2 }}>
									Bitte wähle die GPU-Einheit aus, mit der der Fingerabdruck berechnet werden soll. Diese Einstellung hat keinen Einfluss auf das Ergebnis und ist optional.
								</Typography>
								<FormControl>
									<FormLabel id="variant-label">GPU</FormLabel>
									<RadioGroup
										defaultValue="0"
										name="gpu-group"
										value={gpu}
										onChange={handleChangeGpu}
									>
										<FormControlLabel value="0" control={<Radio />} label="GPU 0" />
										<FormControlLabel value="1" control={<Radio />} label="GPU 1" />
									</RadioGroup>
								</FormControl>
							</Item>
						</Grid>
					</Grid>
					{variant === "StyleGAN" || variant === "StyleGAN2" ?
						<Grid sx={{ mt: 1 }} container spacing={2}>
							<Grid xs={6} md={12}>
								<Item>
									<Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
										Auswahl des Seeds
									</Typography>
									<Typography variant="body1" gutterBottom sx={{ marginBottom: 2, marginTop: 2 }}>
										Der Seed beeinflusst den Output des Models. Der gleiche Seed sorgt jedoch immer für den gleichen Fingerabdruck.
									</Typography>
									<Stack direction="row" spacing={2}>
										<Button onClick={() => randomStyleganSeed()} variant="contained" size="large" startIcon={<CachedIcon />}>
											Zufällig
										</Button>
										<TextField sx={{ width: "60%" }} id="stylegan-seed" value={styleganSeed} variant="standard" onInput={handleChangeStyleganSeed}>
											{styleganSeed}
										</TextField>
									</Stack>
								</Item>
							</Grid>
						</Grid>
						:
						<Grid sx={{ mt: 1 }} container spacing={2}>
							<Grid xs={6} md={6}>
								<Item>
									<Canvas background={backgroundFile} changeFile={changeFile} arrowList={arrowList} onChange={newArrow} />
								</Item>
							</Grid>
							<Grid xs={6} md={6}>
								<Item>
									<Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
										Gesetzte Minutien
									</Typography>
									{arrowList ? makeList(arrowList) : null}
								</Item>
							</Grid>
						</Grid>
					}
				</Box>
				<Fab onClick={() => handleOpen()} sx={fabGreenStyle} variant="extended">
					<Fingerprint sx={{ mr: 1 }} />
					Generieren
				</Fab>
			</Container>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Fingerabdruck</DialogTitle>
				<DialogContent>
					<DialogContentText align="center">
						{resultImage ? <img src={resultImage} /> : <CircularProgress />}

					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Zurück</Button>
					<Button disabled={resultImage ? false : true} onClick={handleDownload}>Download</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment >
	);
}