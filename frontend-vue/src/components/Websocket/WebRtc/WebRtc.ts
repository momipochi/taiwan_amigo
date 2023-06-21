import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { mySocket } from "../Websocket";
import { myVideo, remoteVideo } from "../../ChatRoom/ChatRoom.vue";


export const connectWebRtc = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>
) => {
  let roomID: string;
  const config = {
    iceServers: [{ urls: "stun:stun.mystunserver.tld" }],
  };
  let pc = new RTCPeerConnection(config);
  let constraints = {
    audio: {
      channels: 2,
      autoGainControl: false,
      echoCancellation: false,
      noiseSuppression: false,
    },
    video: true,
  };

  let polite: boolean;
  let makingOffer = false;
  websocketClient.on("onPair", (msg: any) => {
    console.log(msg);
    roomID = msg.id;
    if (mySocket.value == msg.users[0]) {
      polite = true;
    } else {
      polite = false;
    }
    mediaOn();
  });

  websocketClient.on("onPeer", (msg: any) => {
    MatchPlayer(msg);
  });

  async function mediaOn() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }
      console.log(myVideo.value);
      console.log(remoteVideo.value);
      myVideo.value.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  }

  pc.ontrack = ({ track, streams }) => {
    track.onunmute = () => {
      if (remoteVideo.value.srcObject) {
        return;
      }
      remoteVideo.value.srcObject = streams[0];
    };
  };



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
      console.log(data);
      if (data.description) {
        console.log("description");
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
        console.log("candidate");
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
