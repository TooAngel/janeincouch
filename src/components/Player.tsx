import React from 'react';
import { IonCol } from '@ionic/react';
import { Player as PlayerInterface } from '../interfaces/Player'

interface PlayerProps {
  player: PlayerInterface;
}

class Player extends React.Component<PlayerProps, { }> {

  constructor(props: PlayerProps) {
    super(props)
  }

  componentDidMount() {
    // I guess this can be better solved with `React.createRef`, but the types are tricky
    const localVideo: HTMLVideoElement | null = document.querySelector(`video#player${this.props.player.id}`);
    if (localVideo && this.props.player.srcObject) {
      localVideo.srcObject = this.props.player.srcObject;
    }
  }

  render() {
    return (
      <video id={ `player${this.props.player.id}` } autoPlay></video>
    );
  }
};

export default Player;
