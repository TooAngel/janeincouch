import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Player } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Role } from '../interfaces/State'

interface PlayerProps {
  players: Player[];
}

const Players: React.FC<PlayerProps> = (props) => {

  let active = (
    <IonCol size="12">none</IonCol>
  );
  let blues = [];
  let reds = [];
  for (let player of props.players) {
    if (player.role === Role.explaining) {
      active = (
        <IonCol size="12">{player.id} {player.score}</IonCol>
      )
    }
    if (player.team === Team.blue) {
      blues.push(
        <IonCol key={player.id} size="4">{player.id} {player.score}</IonCol>
      )
    }
    if (player.team === Team.red) {
      reds.push(
        <IonCol key={player.id} size="4">{player.id} {player.score}</IonCol>
      )
    }
  }

  return (
    <IonGrid>
      <IonRow>
        {active}
      </IonRow>
      <IonRow>
        {blues}
      </IonRow>
      <IonRow>
        {reds}
      </IonRow>
    </IonGrid>
  );
};

export default Players;
