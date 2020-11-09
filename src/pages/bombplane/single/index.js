import React, { PureComponent } from 'react';
import '../index.css';
import { createWS } from 'utils/ws';
import Checkerboard from "../Checkerboard";
import Rule from "../Rule";

class BombPlaneSingle extends PureComponent {

  state = {
    step: 0,
    // 0:连接断开 1:正在连接 2:游戏准备中 3:游戏开始 4:游戏结束
    gameStatus: 1,
    planes: [],
    showAllPlanesVisible: false,
    showRule: false,
  }

  componentDidMount() {
    this.startNewGame();
  }

  connectServer = () => {
    this.setState({
      gameStatus: 1,
    }, () => {
      const ws = createWS('/ws/plane/single/1/guest');
      this.ws = ws;
      ws.onopen = () => {
        this.sendPlacePlaneCommand();
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
      planes: [],
      showAllPlanesVisible: false,
    })
    this.checkerboard.init();
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const { code } = command;
    if (code === 0) {
      this.onError(command);
    } else if (code === 5) {
      this.onPlacePlaneOver(command);
    } else if (code === 8) {
      this.onBombPoint(command);
    } else if (code === 9) {
      this.onGameOver(command);
    }
  }

  onError = (command) => {
    alert(command.message)
  }

  onPlacePlaneOver = (command) => {
    this.init();
  }

  onBombPoint = (command) => {
    const { x, y, type } = command;
    const { step } = this.state;
    this.setState({
      step: step + 1,
    })
    this.checkerboard.showPoint(y, x, type);
  }

  onGameOver = (command) => {
    this.setState({
      gameStatus: 4,
      planes: command.planes,
      showAllPlanesVisible: true,
    })
  }

  startNewGame = () => {
    if (this.ws) {
      this.sendPlacePlaneCommand();
    } else {
      this.connectServer();
    }
  }

  sendPlacePlaneCommand = () => {
    this.setState({
      gameStatus: 2,
    })
    this.ws.send(JSON.stringify({code: 3}));
  }

  sendBombPointCommand = (x, y) => {
    const { gameStatus } = this.state;
    if (gameStatus === 3) {
      this.ws.send(JSON.stringify({code: 5, x, y}));
    }
  }

  showAllPoint = () => {
    this.setState({
      showAllPlanesVisible: false,
    })
    this.checkerboard.showAllPoint();
  }

  showGameRule = () => {
    this.setState({
      showRule: true,
    })
  }

  getTitleView = () => {
    const { step, gameStatus, showAllPlanesVisible } = this.state;
    if (gameStatus === 0) {
      return <span>连接失败，点击<span onClick={this.connectServer} className="text-clickable">重新连接</span></span>
    }
    if (gameStatus === 1) {
      return <span style={{marginRight: 4}}>正在连接服务器...</span>
    }
    return (
      <div>
        <button style={{marginRight: 4}} onClick={this.showGameRule}>游戏规则</button>
        <button style={{marginRight: 4}} onClick={this.startNewGame}>重新开始</button>
        <span>{gameStatus === 4 ? "游戏结束，共" : "已"}用步数：{step}</span>
        {showAllPlanesVisible && <button style={{marginLeft: 4}} onClick={this.showAllPoint}>显示所有飞机位置</button>}
      </div>
    )
  }

  render() {

    const { planes, showRule } = this.state;

    return (
      <div style={{ padding: 50 }}>
        <div style={{ marginBottom: 8 }}>
          {this.getTitleView()}
        </div>
        <Checkerboard
          onRef={ref => {this.checkerboard = ref}}
          planes={planes}
          onClickCell={(row, col) => this.sendBombPointCommand(col, row)}
        />
        {showRule && <Rule onClose={() => this.setState({showRule: false})} />}
      </div>
    )
  }
}

export default BombPlaneSingle;
