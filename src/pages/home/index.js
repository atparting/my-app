import React from 'react';
import { Link } from "react-router-dom";
import logo from "./logo.svg";
import "./index.css";

function Index() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          <li>
            <Link to='/'>首页</Link>
          </li>
          <li>
            <Link to='/music'>MP3封面提取</Link>
          </li>
          <li>
            <Link to='/bombplane'>炸飞机</Link>
          </li>
          <li>
            <Link to='/mineclearance'>扫雷</Link>
          </li>
        </ul>
      </header>
    </div>
  );
}

export default Index;
