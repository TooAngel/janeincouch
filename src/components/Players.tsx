import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Player as PlayerInterface } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Role } from '../interfaces/State'
import './Players.css'
import { GameMode } from '../interfaces/GameMode'
import { GameState } from '../interfaces/GameState'

import Player from '../components/Player';

interface PlayerProps {
  players: PlayerInterface[];
  gameMode: GameMode;
  gameState: GameState;
}

function getPlayerPlayer(p: PlayerInterface, size: string, muted: boolean, noVideo: boolean): any {
  return (
    <IonRow key={p.id}>
    <IonCol size={size}>
    <Player player={p} muted={muted} noVideo={noVideo} />
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
        activePlayer = getPlayerPlayer(p, '12', this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoSound, this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoCamera);
        allPlayers[p.team].push(getPlayerPlayer(p, '6', true, this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoCamera));
      } else {
        allPlayers[p.team].push(getPlayerPlayer(p, '6', false, false));
      }
    }

    return (
      <IonGrid className="playergrid">
        {activePlayer}
        <IonRow>
          <IonCol>
            <IonGrid className="playergrid">
              {allPlayers[Team.red]}
            </IonGrid>
          </IonCol>
          <IonCol>
            <IonGrid className="playergrid">
              {allPlayers[Team.blue]}
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }
};

export default Players;
