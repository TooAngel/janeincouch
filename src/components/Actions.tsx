import React from 'react';
import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons'

import { Player } from '../interfaces/Player'
import { Role } from '../interfaces/State'
import { GameState } from '../interfaces/GameState'

interface ActionsProps {
  player: Player;
  setPlayer(player: Player): void;
  gameState: GameState;
  startRound(): void;
  server: boolean;
  wordGuessed(): void;
  nextWord(): void;
}

class Actions extends React.Component<ActionsProps, { }> {

  constructor(props: ActionsProps) {
    super(props);
    this.next = this.next.bind(this);
  }

  next(correct: boolean) {
    if (correct) {
      this.props.wordGuessed();
    } else {
      this.props.nextWord();
    }
  }

  render() {
    let buttons = <></>;

    if (this.props.gameState === GameState.Playing) {
      let right: any;
      let wrong: any;
      if (this.props.player.role === Role.explaining) {
        right = (
          <IonButton expand="block" size="large" fill="solid" color="success" onClick={() => this.next(true)}>
          <IonIcon color="light" icon={checkmarkCircleOutline} />
          </IonButton>
        )
        wrong = (
          <IonButton expand="block" size="large" fill="outline" color="danger" onClick={() => this.next(false)}>
          <IonIcon color="danger" icon={closeCircleOutline} />
          </IonButton>
        )
        buttons = (<IonRow>
          <IonCol size="6">{wrong}</IonCol>
          <IonCol size="6">{right}</IonCol>
        </IonRow>);
      }
    } else if (this.props.gameState === GameState.Waiting) {
      if (this.props.server) {
        buttons = (<IonRow>
          <IonCol>
            <IonButton expand="block" size="large" fill="solid" color="success" onClick={() => this.props.startRound()}>
              Start
              &nbsp;
              <IonIcon color="light" icon={checkmarkCircleOutline} />
            </IonButton>
          </IonCol>
        </IonRow>);
      }
    }
    return (
      <IonGrid>
        {buttons}
      </IonGrid>
    );
  }
};

export default Actions;
