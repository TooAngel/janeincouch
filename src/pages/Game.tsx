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

let ps: Player[] = [];
// ps.push({id: "a", team: Team.red, role: Role.explaining, score: 0});
// ps.push({id: "b", team: Team.red, role: Role.guessing, score: 0});
// ps.push({id: "c", team: Team.red, role: Role.guessing, score: 0});
// ps.push({id: "d", team: Team.blue, role: Role.watching, score: 0});
// ps.push({id: "e", team: Team.blue, role: Role.watching, score: 0});
// ps.push({id: "f", team: Team.blue, role: Role.watching, score: 0});



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
  constructor(props: GameProps) {
    super(props);
    this.state = {
      currentPlayerID: 0,
      players: ps,
      words: ws,
      state: GameState.Waiting,
    };
    this.setPlayer = this.setPlayer.bind(this);
    this.initRTC = this.initRTC.bind(this);
    this.initRTC();
  }

  initRTC() {
    const media = navigator.mediaDevices.getUserMedia({video: true, audio: false});
    media.then((stream) => {
      const localVideo: HTMLVideoElement | null = document.querySelector('video#player1');
      if (localVideo) {
          localVideo.srcObject = stream;
      }
      let peer: Peer;
      if (this.props.match.params.leader) {
        ps.push({id: `${ps.length}`, team: Team.red, role: Role.explaining, score: 0, peerId: this.props.match.params.id, srcObject:stream});
        this.setState({players: ps});
        peer = new Peer(this.props.match.params.id, {
          host: 'peer.couchallenge.de',
          port: 9000,
          path: '/myapp',
          key: 'cccccc',
        });
        peer.on('open', (id) => {
          console.log('leader.open');
          console.log('My peer ID is: ' + id);
        })

        peer.on('connection', (conn) => {
          console.log('leader new connection', conn);
          conn.on('data', (data) => {
            console.log('leader got data', data);
            const joiner = JSON.parse(data);
            ps.push({id: `${ps.length}`, team: Team.red, role: Role.explaining, score: 0, peerId: joiner.id, srcObject:stream});
            this.setState({players: ps});
            conn.send(JSON.stringify(ps));
          });
        });
      } else {
        console.log('not leader');
        peer = new Peer({
          host: 'peer.couchallenge.de',
          port: 9000,
          path: '/myapp',
          key: 'cccccc',
        });

        peer.on('open', (id) => {
          var conn = peer.connect(this.props.match.params.id);
          conn.on('open', () => {
            console.log('leader.open');
            console.log('My peer ID is: ' + id);
            conn.send(JSON.stringify({hello: true, id: id}));
          })
          conn.on('data', (data) => {
            console.log('follower got data', data);
            const players: Player[] = JSON.parse(data);
            for (const player of players) {
              if (player.id === id) {
                player.srcObject = stream;
                this.setState({players: players});
                continue;
              }
              const call = peer.call(player.peerId, stream);
              call.on('stream', (remoteStream) => {
                console.log('call out on stream');
                console.log(remoteStream);
                player.srcObject = remoteStream;
                this.setState({players: players});
                // const remoteVideo: HTMLVideoElement | null = document.querySelector('video#player2');
                // if (remoteVideo) {
                //     remoteVideo.srcObject = remoteStream;
                // }
              });
            }
          });
        });
      }

      peer.on('call', (call) => {
        console.log('call', call);
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          // const remoteVideo: HTMLVideoElement | null = document.querySelector('video#player2');
          // if (remoteVideo) {
          //     remoteVideo.srcObject = remoteStream;
          // }
        });
      });

    }, (err) => {
      console.error('Failed to get local stream', err);
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
      components.push(<Actions player={this.state.players[this.state.currentPlayerID]} setPlayer={this.setPlayer} />);
    }

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
