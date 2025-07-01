import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { LobbyWrapper } from "./Lobby/Lobby.js";
import Homepage from "./Homepage/Homepage.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeOptions } from "./MuiTheme";
import ErrorPage from "./ErrorPage/Error";
const theme = createTheme(themeOptions);

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<div className="main">
					<Routes>
						<Route path="/lobby/:id" element={<LobbyWrapper />} />
						<Route path="/lobby/" element={<ErrorPage></ErrorPage>} />
						<Route path="/" element={<Homepage />} />
					</Routes>
				</div>
			</ThemeProvider>
		</div>
	);
}

export default App;
