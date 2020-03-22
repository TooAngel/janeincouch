import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import Peer from 'peerjs';

import './Game.css';

import { Player } from '../interfaces/Player'
import { Team } from '../interfaces/Team'
import { Word } from '../interfaces/Word'
import { Role } from '../interfaces/State'

import Actions from '../components/Actions';
import Players from '../components/Players';
import Scores from '../components/Scores';
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

let ws: Word[] = [];
// p1
// ws.push({playerID: "a", word: "hund", active: true})
// ws.push({playerID: "a", word: "katze"})
// ws.push({playerID: "a", word: "mause"})
//
// // p2
// ws.push({playerID: "b", word: "auto"})
// ws.push({playerID: "b", word: "mopped"})
// ws.push({playerID: "b", word: "rad"})
//
// // p2
// ws.push({playerID: "c", word: "tisch"})
// ws.push({playerID: "c", word: "stuhl"})
// ws.push({playerID: "c", word: "lampe"})
//
// // p4
// ws.push({playerID: "d", word: "baum"})
// ws.push({playerID: "d", word: "blume"})
// ws.push({playerID: "d", word: "strauch"})
//
// // p5
// ws.push({playerID: "e", word: "fenster"})
// ws.push({playerID: "e", word: "tuer"})
// ws.push({playerID: "e", word: "decke"})
//
// // p6
// ws.push({playerID: "f", word: "mond"})
// ws.push({playerID: "f", word: "sonne"})
// ws.push({playerID: "f", word: "sterne"})

enum GameState {
  Waiting,
  Playing
}

class Game extends React.Component<GameProps, { currentPlayerID: number, players: Player[], words: Word[], state: GameState }> {
  peer: Peer;
  stream: MediaStream | null;

  constructor(props: GameProps) {
    super(props);
    this.stream = null;
    this.state = {
      currentPlayerID: 0,
      players: [{id: '0', team: Team.red, role: Role.explaining, score: 0, peerId: this.props.match.params.id, srcObject: null, connection: null}],
      words: ws,
      state: GameState.Waiting,
    };
    this.setPlayer = this.setPlayer.bind(this);
    this.initRTC = this.initRTC.bind(this);
    this.handleServer = this.handleServer.bind(this);
    this.handleClient = this.handleClient.bind(this);
    this.updateClients = this.updateClients.bind(this);

    let connectId = undefined;
    if (this.props.match.params.leader) {
      connectId = this.props.match.params.id;
    }
    const media = navigator.mediaDevices.getUserMedia({video: true, audio: false});
    media.then((stream) => {
      this.stream = stream;
      this.state.players[0].srcObject = this.stream;
      this.setState({players: this.state.players});
    });
    this.peer = new Peer(connectId, {
      host: 'peer.couchallenge.de',
      port: 9000,
      path: '/myapp',
      key: 'cccccc',
    });
    this.initRTC();
  }

  updateClients() {
    const data = {
      state: {
        gameState: this.state.state
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

  handleClient() {
    this.peer.on('open', (id) => {
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
            player.srcObject = oldPlayer.srcObject;
            continue;
          }

          if (player.peerId === id) {
            player.srcObject = this.stream;
            continue;
          }

          if (this.stream) {
            const call = this.peer.call(player.peerId, this.stream);
            call.on('stream', (remoteStream) => {
              console.log('call out on stream', remoteStream);
              player.srcObject = remoteStream;
              this.setState({players: players});
            });
          }
        }
        this.setState({players: players});

      });
    });
  }

  initRTC() {
    console.log('init rtc', this.props.match.params.leader);
    if (this.props.match.params.leader) {
      this.handleServer();
    } else {
      this.handleClient();
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

  render() {
    const components = [];
    components.push(<Players key="players" players={this.state.players} />)
    if (this.state.state === GameState.Playing) {
      components.push(<Scores players={this.state.players} />);
      components.push(<Words words={this.state.words} />);
    }
    components.push(<Actions key="actions" player={this.state.players[this.state.currentPlayerID]} setPlayer={this.setPlayer} />);

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>GameID {this.props.match.params.id}</IonTitle>
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
