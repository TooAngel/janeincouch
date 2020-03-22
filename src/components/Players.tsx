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
  myPeerId: string | undefined;
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

    for (let player of this.props.players) {
      const me = player.peerId === this.props.myPeerId;
      if (player.role === Role.explaining) {
        activePlayer = getPlayerPlayer(player, '12', me || (this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoSound), this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoCamera);
        allPlayers[player.team].push(getPlayerPlayer(player, '6', true, this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoCamera));
      } else {
        allPlayers[player.team].push(getPlayerPlayer(player, '6', me, false));
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
