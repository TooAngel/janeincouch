import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Player as PlayerInterface } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Role } from '../interfaces/State'

import Player from '../components/Player';

interface PlayerProps {
  players: PlayerInterface[];
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
      blues.push(<Player key={player.id} player={player} />);
    }
    if (player.team === Team.red) {
      console.log(player.id);
      reds.push(<Player key={player.id} player={player} />);
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
