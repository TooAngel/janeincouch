import React from 'react';
import { IonTitle } from '@ionic/react';

interface TitleProps {
  gameId: string;
  wordActive: string;
  playerActive: number;
  gameState: number;
  gameMode: number;
  timer: number;
}

class Title extends React.Component<TitleProps, { }> {

  render() {
    return (
      <IonTitle>GameID {this.props.gameId} {this.props.wordActive} {this.props.playerActive} {this.props.gameState === 0 ? 'Waiting' : 'Playing'} {this.props.gameMode === 0 ? 'No Sound' : 'No Camera'} {this.props.timer}</IonTitle>
    );
  }
};

export default Title;
