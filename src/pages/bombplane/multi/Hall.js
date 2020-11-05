import React, { PureComponent } from 'react';
import "../index.css";

class Hall extends PureComponent {

  state = {
    rooms: [],
    // 0:获取房间列表中 1:获取房间列表成功
    status: 0,
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
    this.sendGetRoomCommand();
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const { code } = command;
    if (code === 1) {
      this.onGetRoom(command);
    } else if (code === 2) {
      this.onJoinRoom(command);
    }
  }

  onGetRoom = (command) => {
    this.setState({
      rooms: command.rooms,
      status: 1,
    })
  }

  onJoinRoom = (command) => {
    const { gotoRoom } = this.props;
    const { roomId, player } = command;
    gotoRoom(roomId, player);
  }

  sendGetRoomCommand = () => {
    const { send } = this.props;
    this.setState({
      status: 0,
    })
    send({code: 1});
  }

  sendJoinRoomCommand = roomId => {
    const { send } = this.props;
    send({code: 2, roomId});
  }

  render() {
    const { rooms, status } = this.state;

    return (
      <div>
        {status === 0 ? <span style={{marginLeft: 8}}>获取房间列表中...</span> : <ul>
          {rooms.map(room => {
            const { id, players } = room;
            return (
              <li key={id}>
                <span>{`id: ${id}`}</span>
                <span style={{ marginLeft: 4, marginRight: 4 }}>房间内玩家：</span>
                {players && players.map(player => (
                  player ? <span style={{ marginRight: 4 }}>{player.name}</span> : null
                ))}
                <button onClick={() => this.sendJoinRoomCommand(id)}>进入</button>
              </li>
            )
            }
          )}
        </ul>}
      </div>
    )
  }
}

export default Hall;
