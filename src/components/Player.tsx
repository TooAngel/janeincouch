import React from 'react';
import { Player as PlayerInterface } from '../interfaces/Player'
import './Player.css'

interface PlayerProps {
  player: PlayerInterface;
  muted: boolean;
  noVideo: boolean;
}

class Player extends React.Component<PlayerProps, { }> {

  componentDidMount() {
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && !(Object.keys(srcObject).length === 0 && srcObject.constructor === Object)) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  componentDidUpdate() {
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && !(Object.keys(srcObject).length === 0 && srcObject.constructor === Object)) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  render() {
    return (
      <video id={`player${this.props.player.id}`} muted={this.props.muted} autoPlay={!this.props.noVideo}></video>
    );
  }
};

export default Player;
