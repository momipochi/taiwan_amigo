import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

let roomID: string;
let mySocket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const connectWebRtc = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  websocketClient.on("onConnect", (msg: any) => {
    mySocket = msg.socket;
  });

  websocketClient.on("onMessage", (msg: any) => {
    console.log(msg);
  });

  const config = {
    iceServers: [{ urls: "stun:stun.mystunserver.tld" }],
  };
  const pc = new RTCPeerConnection(config);
  let constraints = {
    audio: {
      channels: 2,
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
    },
    video: true,
  };
  const myVideo = document.getElementById("myVid")!;
  const remoteVideo = document.getElementById("remoteVid");
  let polite: boolean;

  websocketClient.on("onPair", (msg: any) => {
    console.log(msg);
    roomID = msg.id;
    if (mySocket == msg.users[0]) {
      polite = true;
    } else {
      polite = false;
    }
    mediaOn();
  });

  websocketClient.on("onPeer", (msg: any) => {
    console.log(msg);
    MatchPlayer(msg);
  });

  async function mediaOn() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }
      (<HTMLVideoElement>myVideo).srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  }

  pc.ontrack = ({ track, streams }) => {
    track.onunmute = () => {
      if ((<HTMLVideoElement>remoteVideo).srcObject) {
        return;
      }
      (<HTMLVideoElement>remoteVideo).srcObject = streams[0];
    };
  };

  let makingOffer = false;

  pc.onnegotiationneeded = async () => {
    try {
      makingOffer = true;
      await pc.setLocalDescription();
      websocketClient.emit("newDescription", {
        id: roomID,
        description: pc.localDescription,
      });
    } catch (err) {
      console.error(err);
    } finally {
      makingOffer = false;
    }
  };

  pc.onicecandidate = ({ candidate }) =>
    websocketClient.emit("newDescription", {
      id: roomID,
      candidate: candidate,
    });

  let ignoreOffer = false;

  async function MatchPlayer(data: any) {
    try {
      if (data.description) {
        const offerCollision =
          data.description.type == "offer" &&
          (makingOffer || pc.signalingState != "stable");

        ignoreOffer = !polite && offerCollision;
        if (ignoreOffer) {
          return;
        }

        await pc.setRemoteDescription(data.description);
        if (data.description.type == "offer") {
          await pc.setLocalDescription();
          websocketClient.emit("newDescription", {
            id: roomID,
            description: pc.localDescription,
          });
        }
      } else if (data.candidate) {
        try {
          await pc.addIceCandidate(data.candidate);
        } catch (err) {
          if (!ignoreOffer) {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
};
