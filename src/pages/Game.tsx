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
ps.push({id: "a", team: Team.red, role: Role.explaining, score: 0});
ps.push({id: "b", team: Team.red, role: Role.guessing, score: 0});
ps.push({id: "c", team: Team.red, role: Role.guessing, score: 0});
ps.push({id: "d", team: Team.blue, role: Role.watching, score: 0});
ps.push({id: "e", team: Team.blue, role: Role.watching, score: 0});
ps.push({id: "f", team: Team.blue, role: Role.watching, score: 0});



let ws: Word[] = [];
// p1
ws.push({playerID: "a", word: "hund", active: true})
ws.push({playerID: "a", word: "katze"})
ws.push({playerID: "a", word: "mause"})

// p2
ws.push({playerID: "b", word: "auto"})
ws.push({playerID: "b", word: "mopped"})
ws.push({playerID: "b", word: "rad"})

// p2
ws.push({playerID: "c", word: "tisch"})
ws.push({playerID: "c", word: "stuhl"})
ws.push({playerID: "c", word: "lampe"})

// p4
ws.push({playerID: "d", word: "baum"})
ws.push({playerID: "d", word: "blume"})
ws.push({playerID: "d", word: "strauch"})

// p5
ws.push({playerID: "e", word: "fenster"})
ws.push({playerID: "e", word: "tuer"})
ws.push({playerID: "e", word: "decke"})

// p6
ws.push({playerID: "f", word: "mond"})
ws.push({playerID: "f", word: "sonne"})
ws.push({playerID: "f", word: "sterne"})

class Game extends React.Component<GameProps, { currentPlayerID: number, players: Player[], words: Word[] }> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      currentPlayerID: 0,
      players: ps,
      words: ws,
      // localStream: undefined,
    };
    this.myPlayer = this.myPlayer.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<GameProps>, prevState: Readonly<{ currentPlayerID: number; players: Player[]; words: Word[]; }>) {
    console.log('componentDidUpdate');
    const media = navigator.mediaDevices.getUserMedia({video: true, audio: false});
    media.then((stream) => {
      const localVideo: HTMLVideoElement | null = document.querySelector('video#local');
      if (localVideo) {
          localVideo.srcObject = stream;
      }
      if (prevProps.match.params.leader) {
        console.log('leader');
        const peer = new Peer(prevProps.match.params.id, {
          host: 'peer.couchallenge.de',
          port: 9000,
          path: '/myapp',
          key: 'cccccc',
        });
        peer.on('open', (id) => {
          console.log('leader.open');
          console.log('My peer ID is: ' + id);
        })

        peer.on('connection', function(conn) {
          console.log('leader new connection', conn);
        });

        peer.on('call', (call) => {
          console.log('leader.call')
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream) => {
            console.log('leader got stream');
            const remoteVideo: HTMLVideoElement | null = document.querySelector('video#remote');
            if (remoteVideo) {
                remoteVideo.srcObject = remoteStream;
            }
          });
        });
      } else {
        console.log('not leader');
        const peer = new Peer({
          host: 'peer.couchallenge.de',
          port: 9000,
          path: '/myapp',
          key: 'cccccc',
        });


        peer.on('open', (id) => {
          console.log('not leader.open');
          console.log('My peer ID is: ' + id);
          var conn = peer.connect(prevProps.match.params.id);
          console.log('not leader connection', conn);
          const call = peer.call(prevProps.match.params.id, stream);
          call.on('stream', (remoteStream) => {
            console.log('not leader got stream');
            // Show stream in some <video> element.
          });
        })

      }
    }, (err) => {
      console.error('Failed to get local stream', err);
    });

  }

  myPlayer(player: Player) {
    console.log(player);
    const players = this.state.players;
    players[this.state.currentPlayerID] = player;
    this.setState({players: players});
  }

  render() {
    return (
      <IonPage>
      <IonHeader>
      <IonToolbar>
        <IonTitle>GameID {this.props.match.params.id}</IonTitle>
      </IonToolbar>
      </IonHeader>
      <IonContent>
      <Players players={this.state.players} />
      <Words words={this.state.words} />
      <Scores players={this.state.players} />
      <Actions player={this.state.players[this.state.currentPlayerID]} setPlayer={this.myPlayer} />
      <video id='local' autoPlay></video>
      <video id='remote' autoPlay></video>
      </IonContent>
      </IonPage>
    );
  }
};

export default Game;
