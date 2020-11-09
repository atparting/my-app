import React, { PureComponent } from 'react';
import Checkerboard from "../Checkerboard";
import Rule from "../Rule";

class Room extends PureComponent {

  state = {
    ready: false,
    opponent: {},
    // 0:未开始 1:放置飞机 2:正在炸点 3:结束
    status: 0,
    playerPlacePlaneOver: false,
    opponentPlacePlaneOver: false,
    playerPlanes: [],
    opponentPlanes: [],
    // 0没轮到任何人 1轮到你 2轮到对手
    current: 0,
    winner: 0,
    showRule: false,
  }

  componentDidMount() {
    const { onRef, opponent } = this.props;
    onRef(this);
    if (opponent) {
      this.setState({opponent})
    }
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const { code } = command;
    if (code === 3) {
      this.onOpponentChange(command);
    } else if (code === 4) {
      this.onChangeReady(command);
    } else if (code === 5) {
      this.onStartPlacePlane(command);
    } else if (code === 6) {
      this.onPlacePlaneOver(command);
    } else if (code === 7) {
      this.onStartBombPoint(command);
    } else if (code === 8) {
      this.onBombPoint(command);
    } else if (code === 9) {
      this.onGameOver(command);
    }
  }

  onOpponentChange = command => {
    const { player: { id, name }} = command;
    this.setState({
      opponent: {
        id, name, ready: false,
      }
    })
  }

  onChangeReady = command => {
    const { player: { id, ready }} = command;
    const { player: { id: playerId } } = this.props;
    if (playerId === id) {
      this.setState({
        ready,
      })
    } else {
      const { opponent } = this.state;
      this.setState({
        opponent: {
          ...opponent, ready,
        }
      })
    }
  }

  onStartPlacePlane = command => {
    this.checkerboard1.init();
    this.checkerboard2.init();
    this.setState({
      status: 1,
      playerPlacePlaneOver: false,
      opponentPlacePlaneOver: false,
    })
  }

  onPlacePlaneOver = command => {
    const { planes, playerId } = command;
    const { player: { id }} = this.props;
    if (playerId === id) {
      this.setState({
        playerPlacePlaneOver: true,
        playerPlanes: planes,
      })
      this.checkerboard1.showAllPoint();
    } else {
      this.setState({
        opponentPlacePlaneOver: true,
      })
    }
  }

  onStartBombPoint = command => {
    const { owner } = command;
    this.setState({
      status: 2,
      current: owner,
    })
  }

  onBombPoint = command => {
    const { x, y, owner, end, type } = command;
    if (owner === 1) {
      this.checkerboard1.showPoint(y, x, type);
    } else {
      this.checkerboard2.showPoint(y, x, type);
    }
    if (!end) {
      this.setState({
        current: owner,
      })
    }
  }

  onGameOver = command => {
    const { planes, winner } = command;
    const { opponent } = this.state;
    this.setState({
      status: 3,
      opponentPlanes: planes,
      ready: false,
      opponent: {
        ...opponent,
        ready: false,
      },
      winner,
    })
  }

  sendReadyCommand = (ready) => {
    const { send } = this.props;
    send({code: 3, ready});
  }

  sendPlacePlaneCommand = () => {
    const { send } = this.props;
    send({code: 4, random: true});
  }

  sendBombPointCommand = (x, y) => {
    const { send } = this.props;
    const { current, status } = this.state;
    if (current === 1 && status === 2) {
      send({code: 5, x, y});
    }
  }

  showAllPlane = () => {
    const { status } = this.state;
    if (status === 3) {
      this.checkerboard1.showAllPoint();
      this.checkerboard2.showAllPoint();
    }
  }

  render() {

    const { roomId, player: { id: playerId, name: playerName } } = this.props;
    const { status, ready, current, playerPlanes, opponentPlanes, playerPlacePlaneOver, winner, showRule,
      opponent: { id: opponentId, name: opponentName, ready: opponentReady}
    } = this.state;
    const notStart = status === 0 || status === 3;

    return (
      <div>
        <div>当前房间号：{roomId} <button onClick={() => this.setState({showRule: true})}>游戏规则</button></div>
        {!playerPlacePlaneOver && status === 1 && <button onClick={this.sendPlacePlaneCommand}>随机放置飞机</button>}
        {status === 3 && <span>游戏结束，你{winner === playerId ? "赢" : "输"}了</span>}
        {status === 3 && <button onClick={this.showAllPlane}>显示所有飞机位置</button>}
        {status === 2 && <span>{current === 1 ? "你的" : "对家"}回合</span>}
        <div>
          <div>
            <span>ID：{playerId}，name：{playerName}</span>
            {notStart && (ready ?
              <button onClick={() => this.sendReadyCommand(false)}>取消准备</button> :
              <button onClick={() => this.sendReadyCommand(true)}>准备</button>)}
          </div>
          <Checkerboard
            onRef={ref => this.checkerboard1 = ref}
            planes={playerPlanes}
          />
        </div>
        <div>
          <div>
            <span>ID：{opponentId || ""}，name：{opponentName || ""}</span>
            {opponentReady ? <span>已准备</span> : <span>未准备</span>}
          </div>
          <Checkerboard
            onRef={ref => this.checkerboard2 = ref}
            onClickCell={(row, col) => this.sendBombPointCommand(col, row)}
            planes={opponentPlanes}
          />
        </div>
        {showRule && <Rule onClose={() => this.setState({showRule: false})}/>}
      </div>
    )
  }
}

export default Room;
