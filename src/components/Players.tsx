import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Player } from '../interfaces/State'

interface PlayerProps {
  players: Player[];
}

const Players: React.FC<PlayerProps> = (props) => {

  let rows = [];
  for (let player of props.players) {
    rows.push(
      <IonRow>
        <IonCol size="12">{player.id}</IonCol>
      </IonRow>
    )
  }

  return (
    <IonGrid>
      {rows}
    </IonGrid>
  );
};

export default Players;
