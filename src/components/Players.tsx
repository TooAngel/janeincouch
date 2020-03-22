import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Player as PlayerInterface } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Role } from '../interfaces/State'

import Player from '../components/Player';

interface PlayerProps {
  players: PlayerInterface[];
}

function getPlayerPlayer(p: PlayerInterface, size: string): any {
  return (
    <IonRow key={p.id}>
    <IonCol size={size}>
    <Player player={p} />
    </IonCol>
    </IonRow>
  );
}

class Players extends React.Component<PlayerProps, { }> {

  render() {
    console.log('Players render', this.props.players);
    let activePlayer = (<></>);
    let allPlayers: PlayerInterface[][] = [[], []];

    for (let p of this.props.players) {
      if (p.role === Role.explaining) {
        activePlayer = getPlayerPlayer(p, '12');
      }

      allPlayers[p.team].push(getPlayerPlayer(p, '6'));
    }

    return (
      <IonGrid>
        {activePlayer}
        <IonRow>
          <IonCol>
            <IonGrid>
              {allPlayers[Team.red]}
            </IonGrid>
          </IonCol>
          <IonCol>
            <IonGrid>
              {allPlayers[Team.blue]}
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }
};

export default Players;
