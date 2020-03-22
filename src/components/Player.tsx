import React from 'react';
import { Player as PlayerInterface } from '../interfaces/Player'
import './Player.css'

interface PlayerProps {
  player: PlayerInterface;
}

class Player extends React.Component<PlayerProps, { }> {

  componentDidMount() {
    console.log('componentDidMount', this.props.player.srcObject);
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && !(Object.keys(srcObject).length === 0 && srcObject.constructor === Object)) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  componentDidUpdate() {
    console.log('componentDidUpdate', this.props.player.srcObject);
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && !(Object.keys(srcObject).length === 0 && srcObject.constructor === Object)) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  render() {
    console.log('player render');
    return (
      <video id={ `player${this.props.player.id}` } autoPlay></video>
    );
  }
};

export default Player;
