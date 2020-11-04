import React, { PureComponent } from 'react';
import { createWS } from "../../../utils/ws";

class Hall extends PureComponent {

  state = {
    userId: '',
    userName: '',
    rooms: [],
  }

  componentDidMount() {

  }

  connectServer = () => {
    const { userId, userName } = this.state;
    const ws = createWS(`/ws/plane/multi/${userId}/${userName}`);
    this.ws = ws;
    ws.onopen = () => {
      this.sendGetRoomCommand();
    }
    ws.onmessage = evt => {
      this.onMessage(evt.data);
    }
    ws.onclose = () => {
      this.ws = null;
      alert("连接已断开");
    }
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const { code } = command;
    if (code === 0) {
      this.onError(command);
    } else if (code === 1) {
      this.onGetRoom(command);
    }
  }

  onError = (command) => {
    alert(command.message)
  }

  onGetRoom = (command) => {
    this.setState({
      rooms: command.rooms,
    })
  }

  sendGetRoomCommand = () => {
    this.ws.send(JSON.stringify({code: 1}));
  }

  render() {

    const { rooms, userId, userName } = this.state;
    const { history } = this.props;

    return (
      <div>
        <button onClick={() => history.push('/')}>返回首页</button>
        <span>id</span>
        <input onChange={e => this.setState({ id: e.target.value })} value={userId} />
        <span>userName</span>
        <input onChange={e => this.setState({ id: e.target.value })} value={userName} />
        <button onClick={this.connectServer}>连接</button>
        <ul>
          {rooms.map(room => (
            <li>
              <span>{`id: ${room.id}`}</span>
              <button>进入</button>
            </li>
            )
          )}
        </ul>
      </div>
    )
  }
}

export default Hall;
