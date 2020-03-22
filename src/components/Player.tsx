import React from 'react';
import { Player as PlayerInterface } from '../interfaces/Player'
import './Player.css'

interface PlayerProps {
  player: PlayerInterface;
  muted: boolean;
  noVideo: boolean;
}

class Player extends React.Component<PlayerProps, { }> {
  //   video = false;
  //
  // shouldComponentUpdate(nextProps: PlayerProps) {
  //   console.log('shouldComponentUpdate');
  //   console.log(this.props);
  //   console.log(nextProps)
  //
  //   if (!this.video && this.props.player.srcObject !== null) {
  //     console.log('yes');
  //     this.video = true;
  //     return true;
  //   }
  //
  //   if (this.props.muted !== nextProps.muted) {
  //     return true;
  //   } else if (this.props.noVideo !== nextProps.noVideo) {
  //     return true;
  //   } else if (this.props.player.srcObject !== nextProps.player.srcObject) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  componentDidMount() {
    console.log('player componentDidMount');
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && srcObject !== null) {
      console.log('set srcObject');
      localVideo.srcObject = this.props.player.srcObject;
    } else {
      console.log('did not set srcObject', localVideo, srcObject);
    }
  }

  componentDidUpdate() {
    console.log('player componentDidUpdate')
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && srcObject !== null) {
      console.log('set srcObject');
      localVideo.srcObject = this.props.player.srcObject;
    } else {
      console.log('did not set srcObject', localVideo, srcObject);
    }
  }

  render() {
    console.log('player render')
    // TODO disable video (with overlay?)
    return (
      <video id={`player${this.props.player.id}`} muted={this.props.muted} poster="/assets/logo.svg"></video>
    );
  }
};

export default Player;
