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

  let activePlayer = (<></>);
  let active = props.players.filter(p => p.role === Role.explaining);
  if (active.length === 1) {
    activePlayer = (<IonCol size="12"><Player key={active[0].id} player={active[0]} /></IonCol>);
  }

  let blues = props.players.filter(p => p.team === Team.blue);
  let reds = props.players.filter(p => p.team === Team.red);

  let allPlayers: any[] = [];
  for (var r = 0; r < props.players.length / 2; r++) {

    let redPlayer = (<></>);
    let bluePlayer = (<></>);
    if (reds.length > 0) {
      redPlayer = (
        <IonCol key={reds[r].id} size="6">
          <Player player={reds[r]} />
        </IonCol>
      );
    }

    if (blues.length > 0) {
      bluePlayer = (
        <IonCol key={blues[r].id} size="6">
          <Player player={blues[r]} />
        </IonCol>
      );
    }
    allPlayers.push(<IonRow key={r}>{redPlayer}{bluePlayer}</IonRow>)
  }

  return (
    <IonGrid>
      <IonRow>
        {activePlayer}
      </IonRow>
      {allPlayers}
    </IonGrid>
  );
};

export default Players;
