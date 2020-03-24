import React from 'react';
import { IonGrid, IonCol, IonRow } from '@ionic/react';
import { Player as PlayerInterface } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import './Players.css'
import { GameMode } from '../interfaces/GameMode'
import { GameState } from '../interfaces/GameState'

import Player from '../components/Player';

interface PlayerProps {
  players: PlayerInterface[];
  gameMode: GameMode;
  gameState: GameState;
  myPeerId: string | undefined;
  playerActive: number;
}

function getPlayerPlayer(p: PlayerInterface, active: boolean, size: string, muted: boolean, noVideo: boolean, mutedIcon: boolean): any {
  let className = "";
  if (active) {
    className = "active";
  }
  if (p.team === Team.blue) {
    className += " teamblue";
  } else {
    className += " teamred";
  }
  return (
    <IonRow key={p.id + size} className={className}>
      <IonCol size={size}>
        <Player player={p} muted={muted} noVideo={noVideo} mutedIcon={mutedIcon} />
      </IonCol>
    </IonRow>
  );
}

class Players extends React.Component<PlayerProps, { }> {

  render() {
    let activePlayer = (<></>);
    let allPlayers: PlayerInterface[][] = [[], []];

    for (let playerIndex = 0; playerIndex < this.props.players.length; playerIndex++) {
      const player = this.props.players[playerIndex];
      const me = player.peerId === this.props.myPeerId;
      const explaining = playerIndex === this.props.playerActive;
      const muted = me || (this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoSound);
      const noVideo = this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoCamera;
      const mutedIcon = this.props.gameState === GameState.Playing && this.props.gameMode === GameMode.NoSound;

      if (explaining) {
        activePlayer = getPlayerPlayer(player, true, '12', muted, noVideo, mutedIcon);
        allPlayers[player.team].push(getPlayerPlayer(player, false, '12', true, noVideo, false));
      } else {
        allPlayers[player.team].push(getPlayerPlayer(player, false, '12', me, false, false));
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
