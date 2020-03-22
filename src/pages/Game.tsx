import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';
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
import Title from '../components/Title';

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

interface State {
  players: Player[],
  words: string[],
  wordActive: string,
  gameState: GameState,
  playerActive: number,
  gameMode: GameMode,
  timer: number,
  server: boolean
}

class Game extends React.Component<GameProps, State> {
  peer: Peer | null;
  stream: MediaStream | null;
  peerId: string | undefined;
  interval: number | undefined;

  constructor(props: GameProps) {
    super(props);
    this.peer = null;
    this.stream = null;
    this.peerId = undefined;
    this.interval = undefined;
    let server = false;
    if (this.props.match.params.leader) {
      this.peerId = this.props.match.params.id;
      server = true;
    }
    this.state = {
      players: [{id: '0', team: Team.red, role: Role.explaining, leader: true, score: 0, peerId: this.peerId || '', srcObject: null, connection: null}],
      words: ['hund', 'katze', 'mause', 'auto', 'mopped', 'rad', 'tische', 'stuhl', 'lample', 'baum', 'blume', 'strauch', 'fenster', 'tuer', 'decke', 'mond', 'sonne', 'sterne'],
      wordActive: '',
      playerActive: 0,
      gameState: GameState.Waiting,
      gameMode: GameMode.NoSound,
      timer: 300,
      server: server,
    };
    this.setPlayer = this.setPlayer.bind(this);
    this.initRTC = this.initRTC.bind(this);
    this.handleServer = this.handleServer.bind(this);
    this.handleClient = this.handleClient.bind(this);
    this.updateClients = this.updateClients.bind(this);
    this.startRound = this.startRound.bind(this);
    this.handleClientOpenPeer = this.handleClientOpenPeer.bind(this);

    const media = navigator.mediaDevices.getUserMedia({video: true, audio: true});
    media.then((stream) => {
      this.stream = stream;
      const players = this.state.players;
      players[0].srcObject = this.stream;
      this.setState({players: players});
      this.initRTC();
    });
  }

  updateClients(config: State) {
    const data = {
      state: {
        wordActive: config.wordActive,
        playerActive: config.playerActive,
        gameState: config.gameState,
        gameMode: config.gameMode,
        timer: config.timer,
      },
      players: config.players
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
    let port = 9001;
    if (window.location.protocol === "https:") {
      port = 9002;
    }
    this.peer = new Peer(this.peerId, {
      host: 'peer.couchallenge.de',
      port: port,
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
        this.updateClients(this.state);
      });
    });
  }

  handleClientOpenPeer(id: string) {
    if (id === null) {
      console.log('handleClientOpenPeer peer.on open id = null, why?');
      return;
    }
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
      const state = message.state;
      console.log(state.gameState, GameState.Playing);
      if (state.gameState === GameState.Playing) {
        this.interval = window.setInterval(() => this.handleTimer(), 1000);
      }
      this.setState({
        players: players,
        wordActive: state.wordActive,
        playerActive: state.playerActive,
        gameState: state.gameState,
        gameMode: state.gameMode,
        timer: state.timer
      });
    });
  }

  handleClient() {
    console.log('handle client');

    let port = 9001;
    if (window.location.protocol === "https:") {
      port = 9002;
    }

    this.peer = new Peer(this.peerId, {
      host: 'peer.couchallenge.de',
      port: port,
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
    players[this.state.playerActive] = player;
    this.setState({players: players});
  }

  handleTimer() {
    let timer = this.state.timer - 1;
    if (timer <= 0) {
      this.setState({gameState: GameState.Waiting, timer: timer});
      clearInterval(this.interval);
    } else {
      this.setState({timer: timer});
    }
  }

  startRound() {
    console.log('startRound');
    const word = this.state.words[Math.floor(Math.random() * this.state.words.length)];
    const player = Math.floor(Math.random() * this.state.players.length);
    const gameMode = Math.floor(Math.random() * 2);
    this.setState({wordActive: word, playerActive: player, gameState: GameState.Playing, gameMode: gameMode, timer: 30});
    this.interval = window.setInterval(() => this.handleTimer(), 1000);
    const data = {
      wordActive: word,
      playerActive: player,
      gameState: GameState.Playing,
      gameMode: gameMode,
      timer: 30,
      words: this.state.words,
      players: this.state.players,
      server: false,
    };
    this.updateClients(data);
  }

  render() {
    const components = [];
    components.push(<Players key="players" players={this.state.players} gameState={this.state.gameState} gameMode={this.state.gameMode} myPeerId={this.peerId} playerActive={this.state.playerActive}/>)
    if (this.state.gameState === GameState.Playing) {
      // components.push(<Scores players={this.state.players} />);
      components.push(<Words key="words" word={this.state.wordActive} />);
    }
    components.push(<Actions key="actions" player={this.state.players[this.state.playerActive]} setPlayer={this.setPlayer} gameState={this.state.gameState} startRound={this.startRound} server={this.state.server}/>);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <Title gameId={this.props.match.params.id} wordActive={this.state.wordActive} playerActive={this.state.playerActive} gameState={this.state.gameState} gameMode={this.state.gameMode} timer={this.state.timer} />
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
