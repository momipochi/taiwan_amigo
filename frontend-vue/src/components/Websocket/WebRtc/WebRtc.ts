import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { mySocket } from "../Websocket";
import { myVideo, remoteVideo } from "../../ChatRoom/ChatRoom.vue";

export interface WebRTCModel {
  sendMessage: (msg: string) => void;
}

interface WebRTCEventModel {
  onMessage: (msg: NewMessageModel) => void;
}

export interface NewMessageModel {
  name: string;
  message: string;
  typing: boolean;
  content: string;
}

export const connectWebRtc = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>,
  modelEvent: WebRTCEventModel
): Promise<WebRTCModel> => {
  let channelInstance: RTCDataChannel;
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
  let stream;
  let polite: boolean;
  let makingOffer = false;
  websocketClient.on("onPair", (msg: any) => {
    console.log(msg);
    roomID = msg.id;
    if (mySocket.value === msg.users[0]) {
      polite = true;
    } else {
      polite = false;
    }
    mediaOn();
  });

  websocketClient.on("onPeer", (msg: any) => {
    console.log("onpeer");
    MatchPlayer(msg);
  });

  function setupChannelAsHost() {
    try {
      channelInstance = pc.createDataChannel("WebRTC_Host");
      channelInstance.onopen = () => {
        console.log("host channel opened");
      };
      channelInstance.onmessage = (event) => {
        modelEvent.onMessage({
          name: "Host",
          message: `${event.data}`,
          typing: false,
          content: "",
        });
        console.log(`Received message via host webrtc: ${event.data}`);
      };
    } catch (error) {
      console.error("No data channel (peerConnection)", error);
    }
  }

  function setupChannelAsARecipient() {
    pc.ondatachannel = function ({ channel }) {
      channelInstance = channel;
      channelInstance.onopen = function () {
        console.log("slave channel opened");
      };

      channelInstance.onmessage = function (event) {
        modelEvent.onMessage({
          name: "Slave",
          message: `${event.data}`,
          typing: false,
          content: "",
        });
        console.log(`Received message via slave webrtc: ${event.data}`);
      };
    };
  }

  function sendMessage(msg: string) {
    if (channelInstance) {
      channelInstance.send(msg);
    }
  }

  async function mediaOn() {
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);

      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }
      if (myVideo.value) {
        myVideo.value.srcObject = stream;
        console.log(myVideo.value.srcObject);
      }
    } catch (err) {
      console.error(err);
    }
  }

  pc.ontrack = ({ track, streams }) => {
    track.onunmute = () => {
      if (remoteVideo.value) {
        if (remoteVideo.value.srcObject) {
          return;
        }
        remoteVideo.value.srcObject = streams[0];
        console.log(remoteVideo.value);
      }
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
      console.log("match");
      console.log(data);
      if (data.description) {
        console.log("description");
        const offerCollision =
          data.description.type === "offer" &&
          (makingOffer || pc.signalingState != "stable");

        ignoreOffer = !polite && offerCollision;
        if (ignoreOffer) {
          return;
        }
        await pc.setRemoteDescription(data.description);
        if (data.description.type === "offer") {
          await pc.setLocalDescription();
          websocketClient.emit("newDescription", {
            id: roomID,
            description: pc.localDescription,
          });
          setupChannelAsHost();
        } else {
          setupChannelAsARecipient();
        }
      } else if (data.candidate) {
        console.log("candidate");
        try {
          console.log("addice");
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
  return new Promise((res) => res({ sendMessage }));
};
