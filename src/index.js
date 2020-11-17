import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Footer from "./component/Footer";
import Home from './pages/home';
import Music from './pages/Music';
import BombPlane from './pages/bombplane';
import BombPlaneSingle from './pages/bombplane/single';
import BombPlaneMulti from './pages/bombplane/multi';
import Minesweeper from './pages/minesweeper';
import Snake from './pages/snake';
import { BrowserRouter, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route path='/' exact component={Home} />
      <Route path='/music' exact component={Music} />
      <Route path='/bombplane' exact component={BombPlane} />
      <Route path='/bombplane/single' exact component={BombPlaneSingle} />
      <Route path='/bombplane/multi' exact component={BombPlaneMulti} />
      <Route path='/minesweeper' exact component={Minesweeper} />
      <Route path='/snake' exact component={Snake} />
    </BrowserRouter>
    <Footer/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
