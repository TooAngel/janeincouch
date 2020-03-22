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
      players: [{id: '0', team: Team.red, role: Role.explaining, score: 0, peerId: this.props.match.params.id, srcObject: null}],
      words: ws,
      state: GameState.Waiting,
    };
    this.setPlayer = this.setPlayer.bind(this);
    this.initRTC = this.initRTC.bind(this);
    this.handleServer = this.handleServer.bind(this);
    this.handleClient = this.handleClient.bind(this);
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

  handleServer() {
    this.peer.on('open', (id) => {
      console.log('leader.open');
      console.log('My peer ID is: ' + id);
    })

    this.peer.on('connection', (conn) => {
      console.log('leader new connection', conn);
      conn.on('data', (data) => {
        console.log('leader got data', data);
        const joiner = JSON.parse(data);
        this.state.players.push({id: `${this.state.players.length}`, team: this.state.players.length % 2, role: Role.explaining, score: 0, peerId: joiner.id, srcObject:null});
        this.setState({players: this.state.players});

        // TODO send to all players in the list the updated list
        conn.send(JSON.stringify(this.state.players));
      });
    });
  }

  handleClient() {
    console.log('not leader');
    this.peer.on('open', (id) => {
      var conn = this.peer.connect(this.props.match.params.id);
      conn.on('open', () => {
        console.log('leader.open');
        console.log('My peer ID is: ' + id);
        conn.send(JSON.stringify({hello: true, id: id}));
      })
      conn.on('data', (data) => {
        console.log('follower got data', data);
        const players: Player[] = JSON.parse(data);
        for (const player of players) {
          if (player.peerId === id) {
            player.srcObject = this.stream;
            this.setState({players: players});
            continue;
          }
          if (this.stream) {
            const call = this.peer.call(player.peerId, this.stream);
            call.on('stream', (remoteStream) => {
              console.log('call out on stream');
              console.log(remoteStream);
              player.srcObject = remoteStream;
              this.setState({players: players});
              console.log(players);
              // const remoteVideo: HTMLVideoElement | null = document.querySelector('video#player2');
              // if (remoteVideo) {
                //     remoteVideo.srcObject = remoteStream;
                // }
              });
          }
        }
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
          const players = this.state.players.filter((player) => {return player.peerId === call.peer});
          for (const player of players) {
            console.log('Setting stream to', player)
            player.srcObject = remoteStream;
            this.setState({players: this.state.players})
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
    console.log('render', this.state.players)
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
