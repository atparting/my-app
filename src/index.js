import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Footer from "./component/Footer";
import Home from './pages/home';
import Music from './pages/Music';
import BombPlane from './pages/bombplane';
import SingleGame from './pages/bombplane/single';
import Hall from './pages/bombplane/multi/Hall';
import Room from './pages/bombplane/multi/Room';
import Game from './pages/bombplane/multi/Game';
import { BrowserRouter, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route path='/' exact component={Home} />
      <Route path='/music' exact component={Music} />
      <Route path='/bombplane' exact component={BombPlane} />
      <Route path='/bombplane/single' exact component={SingleGame} />
      <Route path='/bombplane/multi/hall' exact component={Hall} />
      <Route path='/bombplane/multi/room' exact component={Room} />
      <Route path='/bombplane/multi/game' exact component={Game} />
    </BrowserRouter>
    <Footer/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
