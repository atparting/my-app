import React, {PureComponent} from 'react';
import './index.css';
import {createWS} from 'utils/ws';
import Checkerboard from "./Checkerboard";

class Snake extends PureComponent {

  state = {
    // 0:连接断开 1:正在连接 2:未开始 3:游戏开始 4:游戏暂停 5:游戏结束
    gameStatus: 1,
  }

  componentDidMount() {
    this.startNewGame();
  }

  connectServer = () => {
    this.setState({
      gameStatus: 1,
    }, () => {
      const ws = createWS('/ws/snake');
      this.ws = ws;
      ws.onopen = () => {
        this.sendStartGameCommand();
      }
      ws.onmessage = evt => {
        this.onMessage(evt.data);
      }
      ws.onclose = () => {
        this.ws = null;
        this.setState({
          gameStatus: 0,
        })
        alert("连接已断开");
      }
    })
  }

  init = () => {
    this.setState({
      gameStatus: 3,
    })
    this.checkerboard.init();
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const {code} = command;
    if (code === 0) {
      this.onError(command);
    } else if (code === 1) {
      this.onStartGame(command);
    } else if (code === 2) {
      this.onChangePosition(command);
    } else if (code === 3) {
      this.onChangeFood(command);
    } else if (code === 4) {
      this.onStopGame(command);
    } else if (code === 5) {
      this.onGameOver(command);
    }
  }

  onError = (command) => {
    alert(command.message)
  }

  onStartGame = command => {
    this.init();
  }

  onChangePosition = command => {
    const { points, direction } = command;
    this.checkerboard.changePosition(points, direction);
  }

  onChangeFood = command => {
    const { x, y } = command;
    this.checkerboard.changeFood(y, x);
  }

  onStopGame = command => {
    const { type } = command;
    this.setState({
      gameStatus: type === 1 ? 3 : 4,
    })
  }

  onGameOver = command => {
    this.setState({
      gameStatus: 5,
    })
  }

  startNewGame = () => {
    if (this.ws) {
      this.sendStartGameCommand();
    } else {
      this.connectServer();
    }
  }

  sendStartGameCommand = () => {
    this.setState({
      gameStatus: 2,
    })
    this.ws.send(JSON.stringify({code: 1}));
  }

  sendChangeDirectionCommand = (direction) => {
    const { gameStatus } = this.state;
    if (gameStatus === 3 || gameStatus === 4) {
      this.ws.send(JSON.stringify({code: 2, direction}));
    }
  }

  sendStopGameCommand = (stop) => {
    const { gameStatus } = this.state;
    if (stop) {
      if (gameStatus === 3) {
        this.ws.send(JSON.stringify({code: 3, type: 2}));
      }
    } else {
      if (gameStatus === 4) {
        this.ws.send(JSON.stringify({code: 3, type: 1}));
      }
    }
  }

  getTitleView = () => {
    const { gameStatus } = this.state;
    if (gameStatus === 0) {
      return <span>连接失败，点击<span onClick={this.connectServer} className="text-clickable">重新连接</span></span>
    }
    if (gameStatus === 1) {
      return <span style={{marginRight: 4}}>正在连接服务器...</span>
    }
    return (
      <div>
        <button style={{marginRight: 4}} onClick={this.startNewGame}>重新开始</button>
        {gameStatus === 3 && <button style={{marginRight: 4}} onClick={() => this.sendStopGameCommand(true)}>暂停</button>}
        {gameStatus === 4 && <button style={{marginRight: 4}} onClick={() => this.sendStopGameCommand(false)}>继续</button>}
        {gameStatus === 5 && <span>游戏结束</span>}
      </div>
    )
  }

  render() {

    return (
      <div style={{padding: 50}}>
        <div style={{marginBottom: 8}}>
          {this.getTitleView()}
        </div>
        <Checkerboard
          onRef={ref => {
            this.checkerboard = ref
          }}
          onChangeDirection={this.sendChangeDirectionCommand}
        />
      </div>
    )
  }
}

export default Snake;
