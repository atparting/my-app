import React, {PureComponent} from 'react';
import {createWS} from "utils/ws";
import "../index.css";
import Hall from './Hall';
import Room from './Room';

class BombPlaneMulti extends PureComponent {

  state = {
    userId: '',
    userName: '',
    // 0:连接断开 1:未连接 2:正在连接 3:已连接
    status: 1,
    // 0未登录 1大厅 2房间
    position: 0,
    room: {
      id: null,
      player: {
        id: null,
        name: null,
      }
    }
  }

  componentDidMount() {

  }

  connectServer = () => {
    const {userId, userName} = this.state;
    if (userId.length === 0 || userName.length === 0) {
      alert("请输入id和昵称");
      return;
    }
    this.setState({
      status: 2,
    })
    const ws = createWS(`/ws/plane/multi/${userId}/${userName}`);
    this.ws = ws;
    ws.onopen = () => {
      this.setState({
        status: 3,
      })
      this.gotoHall();
    }
    ws.onmessage = evt => {
      this.onMessage(evt.data);
    }
    ws.onclose = () => {
      this.ws = null;
      this.setState({
        status: 0,
        position: 0,
      })
      alert("连接已断开");
    }
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const {code} = command;
    if (code === 0) {
      this.onError(command);
    } else {
      if (this.hall) {
        this.hall.onMessage(msg);
      }
      if (this.room) {
        this.room.onMessage(msg);
      }
    }
  }

  onError = (command) => {
    alert(command.message)
  }

  gotoNotLogin = () => {
    this.setState({
      position: 0,
    })
  }

  gotoHall = () => {
    this.setState({
      position: 1,
    })
  }

  gotoRoom = (roomId, opponent) => {
    const { userId, userName } = this.state;
    this.setState({
      position: 2,
      room: {
        id: roomId,
        player: {
          id: Number(userId),
          name: userName,
          ready: false,
        },
      },
      opponent: opponent || {},
    })
  }

  getTitleView = () => {
    const {status, userId, userName, position} = this.state;
    if (status === 0) {
      return <span>连接失败，点击<span onClick={this.connectServer} className="text-clickable">重新连接</span></span>
    }
    if (status === 1) {
      return (
        <span>
          <span style={{marginRight: 4}}>id</span>
          <input onChange={e => this.setState({userId: e.target.value})} value={userId}/>
          <span style={{marginRight: 4, marginLeft: 8}}>userName</span>
          <input onChange={e => this.setState({userName: e.target.value})} value={userName}/>
          <button onClick={this.connectServer} style={{marginLeft: 8}}>进入大厅</button>
        </span>
      )
    }
    return (
      <span>
        <span style={{marginRight: 8}}>id：{userId}，userName：{userName}</span>
        {status === 2 && <span style={{marginLeft: 8}}>连接中...</span>}
        {position === 1 && <button onClick={() => this.hall.sendGetRoomCommand()}>刷新</button>}
      </span>
    )
  }

  getContent = () => {
    const { position, room: { id: roomId, player }, opponent } = this.state;
    if (position === 1) {
      return (
        <Hall
          gotoRoom={this.gotoRoom}
          gotoNotLogin={this.gotoNotLogin}
          onRef={ref => {this.hall = ref}}
          send={msg => this.ws.send(JSON.stringify(msg))}
        />
      )
    }
    if (position === 2) {
      return (
        <Room
          gotoHall={this.gotoHall}
          gotoNotLogin={this.gotoNotLogin}
          onRef={ref => {this.room = ref}}
          send={msg => this.ws.send(JSON.stringify(msg))}
          roomId={roomId}
          player={player}
          opponent={opponent}
        />
      )
    }
    return null;
  }

  render() {
    const {history} = this.props;

    return (
      <div style={{padding: 50}}>
        <div>
          <button onClick={() => history.push('/')} style={{marginRight: 8}}>返回首页</button>
          {this.getTitleView()}
        </div>
        {this.getContent()}
      </div>
    )
  }
}

export default BombPlaneMulti;
