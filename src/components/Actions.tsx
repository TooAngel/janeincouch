import React from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';

import { Player } from '../interfaces/Player'
import { Role } from '../interfaces/State'

interface ActionsProps {
  player: Player;
  setPlayer(player: Player): void;
}

const Actions: React.FC<ActionsProps> = (props) => {

  function next(correct: boolean) {
    let p = props.player;
    if (correct) {
      p.score++
      props.setPlayer(p);
    }

    console.log(props.player.score);
  }

  let right: any;
  let wrong: any;
  if (props.player.role === Role.explaining) {
    right = (
      <IonButton color="primary" onClick={() => next(true)}>
        Richtig
      </IonButton>
    )
    wrong = (
      <IonButton onClick={() => next(false)}>
        Weiter
      </IonButton>
    )
  }
  return (
    <IonGrid>
      <IonRow>
        <IonCol>{wrong}</IonCol>
        <IonCol>{right}</IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Actions;
