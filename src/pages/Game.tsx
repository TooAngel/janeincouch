import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Peer from 'peerjs';

import './Game.css';

import { Player } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Role } from '../interfaces/State'
import { GameState } from '../interfaces/GameState'
import { GameMode } from '../interfaces/GameMode'

import Actions from '../components/Actions';
import Players from '../components/Players';
// import Scores from '../components/Scores';
import Words from '../components/Words';

interface Params {
  id: string;
  leader: string;
}

interface Match {
  params: Params;
}

interface GameProps {
  match: Match;
}

class Game extends React.Component<GameProps, { currentPlayerID: number, players: Player[], words: string[], wordActive: string, gameState: GameState, streamAvailable: boolean, playerActive: number, gameMode: GameMode.NoSound}> {
  peer: Peer | null;
  stream: MediaStream | null;
  peerId: string | undefined;

  constructor(props: GameProps) {
    super(props);
    this.peer = null;
    this.stream = null;
    this.peerId = undefined;
    if (this.props.match.params.leader) {
      this.peerId = this.props.match.params.id;
    }
    this.state = {
      currentPlayerID: 0,
      players: [{id: '0', team: Team.red, role: Role.explaining, leader: true, score: 0, peerId: this.peerId || '', srcObject: null, connection: null}],
      words: ['hund', 'katze', 'mause', 'auto', 'mopped', 'rad', 'tische', 'stuhl', 'lample', 'baum', 'blume', 'strauch', 'fenster', 'tuer', 'decke', 'mond', 'sonne', 'sterne'],
      wordActive: '',
      playerActive: 0,
      gameState: GameState.Waiting,
      streamAvailable: false,
      gameMode: GameMode.NoSound,
    };
    this.setPlayer = this.setPlayer.bind(this);
    this.initRTC = this.initRTC.bind(this);
    this.handleServer = this.handleServer.bind(this);
    this.handleClient = this.handleClient.bind(this);
    this.updateClients = this.updateClients.bind(this);
    this.startRound = this.startRound.bind(this);
    this.handleClientOpenPeer = this.handleClientOpenPeer.bind(this);

    const media = navigator.mediaDevices.getUserMedia({video: true, audio: false});
    media.then((stream) => {
      this.stream = stream;
      this.state.players[0].srcObject = this.stream;
      this.setState({players: this.state.players});
      this.setState({streamAvailable: true});
      this.initRTC();
    });
  }

  updateClients() {
    const data = {
      state: {
        gameState: this.state.gameState
      },
      players: this.state.players
    };
    const replacer = (key: string, value: any) => {
      if (key === 'srcObject' || key === 'connection') {
        return null
      }
      return value;
    };
    const message = JSON.stringify(data, replacer);
    for (const player of this.state.players) {
      if (!player.connection) {
        continue;
      }

      player.connection.send(message);
    }
  }

  handleServer() {
    this.peer = new Peer(this.peerId, {
      host: 'peer.couchallenge.de',
      port: 9000,
      path: '/myapp',
      key: 'cccccc',
    });
    this.peer.on('open', (id) => {
      console.log('server on open', id);
    })

    this.peer.on('connection', (conn) => {
      console.log('server on connection', conn);
      conn.on('data', (data) => {
        console.log('server on data', data);
        this.state.players.push({
          id: `${this.state.players.length}`,
          team: this.state.players.length % 2,
          role: Role.explaining,
          leader: false,
          score: 0,
          peerId: conn.peer,
          srcObject: null,
          connection: conn,
        });
        this.setState({players: this.state.players});
        this.updateClients();
      });
    });
  }

  handleClientOpenPeer(id: string) {
    if (id === null) {
      console.log('handleClientOpenPeer peer.on open id = null, why?');
      return;
    }
    let currentPlayerID = this.state.currentPlayerID;

    if (this.peer === null) {
      console.log('handleClient peer.on open this.peer = null, why?');
      return;
    }
    var conn = this.peer.connect(this.props.match.params.id);
    conn.on('open', () => {
      console.log('client on open', id);
      conn.send(JSON.stringify({hello: true}));
    })
    conn.on('data', (data) => {
      console.log('client on data', data);
      const message = JSON.parse(data);
      const players: Player[] = message.players;
      for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
        const player = players[playerIndex];
        const oldPlayer = this.state.players.find(element => element.peerId === player.peerId && !!element.srcObject);
        if (oldPlayer) {
          console.log('oldPlayer found', player, oldPlayer);
          player.srcObject = oldPlayer.srcObject;
          continue;
        }

        if (player.peerId === id) {
          console.log('call it is me');
          currentPlayerID = playerIndex;
          player.srcObject = this.stream;
          continue;
        }

        if (this.stream) {
          if (this.peer === null) {
            console.log('handleClient peer.on data this.peer = null, why?');
            return;
          }
          const call = this.peer.call(player.peerId, this.stream);
          call.on('stream', (remoteStream) => {
            console.log('call out on stream', remoteStream);
            player.srcObject = remoteStream;
            this.setState({players: players});
          });
        }
      }
      this.setState({players: players, currentPlayerID: currentPlayerID});
    });
  }

  handleClient() {
    console.log('handle client');

    this.peer = new Peer(this.peerId, {
      host: 'peer.couchallenge.de',
      port: 9000,
      path: '/myapp',
      key: 'cccccc',
    });
    console.log('peer id', this.peer.id);
    this.peer.on('open', (id) => {
      this.handleClientOpenPeer(id);
    });
  }

  initRTC() {
    console.log('init rtc', this.props.match.params.leader);

    if (this.props.match.params.leader) {
      this.handleServer();
    } else {
      this.handleClient();
    }
    if (this.peer === null) {
      console.log('handleClient this.peer = null, why?');
      return;
    }
    this.peer.on('call', (call) => {
      console.log('call', call);
      if (this.stream) {
        call.answer(this.stream);
        call.on('stream', (remoteStream) => {
          const player = this.state.players.find((player) => player.peerId === call.peer);
          if (player) {
            console.log('Setting stream to', player)
            player.srcObject = remoteStream;
            this.setState({players: this.state.players})
          } else {
            console.log('Can not find player in players on call', call, this.state.players);
          }
        });
      }
    });
  }

  setPlayer(player: Player) {
    const players = this.state.players;
    players[this.state.currentPlayerID] = player;
    this.setState({players: players});
  }

  startRound() {
    console.log('startRound');
    const word = this.state.words[Math.floor(Math.random() * this.state.words.length)];
    const player = Math.floor(Math.random() * this.state.players.length);
    const gameMode = Math.floor(Math.random() * 2);
    this.setState({wordActive: word, playerActive: player, gameState: GameState.Playing, gameMode: gameMode});
  }

  render() {
    const components = [];
    components.push(<Players key="players" players={this.state.players} />)
    if (this.state.gameState === GameState.Playing) {
      // components.push(<Scores players={this.state.players} />);
      components.push(<Words word={this.state.wordActive} />);
    }
    components.push(<Actions key="actions" player={this.state.players[this.state.currentPlayerID]} setPlayer={this.setPlayer} gameState={this.state.gameState} startRound={this.startRound}/>);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>GameID {this.props.match.params.id} {this.state.wordActive} {this.state.playerActive} {this.state.gameState === 0 ? 'Waiting' : 'Playing'} {this.state.gameMode === 0 ? 'No Sound' : 'No Camera'}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {components}
        </IonContent>
      </IonPage>
    );
  }
};

export default Game;
