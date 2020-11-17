import React, {PureComponent} from 'react';
import './index.css';
import {createWS} from 'utils/ws';
import Checkerboard from "./Checkerboard";

class MineClearance extends PureComponent {

  state = {
    step: 0,
    // 0:连接断开 1:正在连接 2:未开始 3:游戏开始 4:游戏结束
    gameStatus: 1,
    win: false,
    mines: [],
  }

  componentDidMount() {
    this.startNewGame();
  }

  connectServer = () => {
    this.setState({
      gameStatus: 1,
    }, () => {
      const ws = createWS('/ws/mine');
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
      step: 0,
      gameStatus: 3,
      win: false,
      mines: [],
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
      this.onShowPoint(command);
    } else if (code === 3) {
      this.onChangePointFlag(command);
    } else if (code === 4) {
      this.onGameOver(command);
    }
  }

  onError = (command) => {
    alert(command.message)
  }

  onStartGame = (command) => {
    this.init();
  }

  onShowPoint = (command) => {
    const {points} = command;
    const {step} = this.state;
    this.setState({
      step: step + 1,
    })
    this.checkerboard.showPoints(points);
  }

  onChangePointFlag = command => {
    const { x, y, flag } = command;
    this.checkerboard.changePointStatus(y, x, flag);
  }

  onGameOver = (command) => {
    const {win, mines} = command;
    this.setState({
      gameStatus: 4,
      win,
    })
    if (!win) {
      this.checkerboard.showAllMinePoint(mines);
    }
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

  sendClearanceCommand = (x, y, type) => {
    const { gameStatus } = this.state;
    if (gameStatus === 3) {
      this.ws.send(JSON.stringify({code: 2, x, y, type}));
    }
  }

  getTitleView = () => {
    const {step, gameStatus, win} = this.state;
    if (gameStatus === 0) {
      return <span>连接失败，点击<span onClick={this.connectServer} className="text-clickable">重新连接</span></span>
    }
    if (gameStatus === 1) {
      return <span style={{marginRight: 4}}>正在连接服务器...</span>
    }
    return (
      <div>
        <button style={{marginRight: 4}} onClick={this.startNewGame}>重新开始</button>
        {gameStatus === 4 && <span>你{win ? "赢" : "输"}了！</span>}
        <span>已用步数：{step}</span>
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
          onClickCell={(row, col, button) => this.sendClearanceCommand(col, row, button)}
        />
      </div>
    )
  }
}

export default MineClearance;
