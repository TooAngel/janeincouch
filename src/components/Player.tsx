import React from 'react';
import { Player as PlayerInterface } from '../interfaces/Player'
import './Player.css'

interface PlayerProps {
  player: PlayerInterface;
  muted: boolean;
  noVideo: boolean;
}

class Player extends React.Component<PlayerProps, {videoLoaded: boolean, postFix: number }> {

  constructor(props: PlayerProps) {
    super(props);
    this.state = {
      videoLoaded: false,
      postFix: Math.floor(Math.random() * 100),
    }
  }

  shouldComponentUpdate(nextProps: PlayerProps) {
    // TODO not sure why I need this hack
    if (!this.state.videoLoaded && nextProps.player.srcObject !== null) {
      this.setState({videoLoaded: true});
      return true;
    }
    if (this.props.muted !== nextProps.muted) {
      return true;
    } else if (this.props.noVideo !== nextProps.noVideo) {
      return true;
    } else if (this.props.player.srcObject !== nextProps.player.srcObject) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id + this.state.postFix}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && srcObject !== null) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  componentDidUpdate() {
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id + this.state.postFix}`);
    const srcObject = this.props.player.srcObject;
    if (localVideo && srcObject && srcObject !== null) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  render() {
    // TODO disable video (with overlay?)
    return (
      <video id={`player${this.props.player.id + this.state.postFix}`} muted={this.props.muted} poster="/assets/logo.svg" autoPlay></video>
    );
  }
};

export default Player;
