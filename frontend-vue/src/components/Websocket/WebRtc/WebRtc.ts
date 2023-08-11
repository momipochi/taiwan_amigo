import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { mySocket } from "../Websocket";
import { myVideo, remoteVideo } from "../../ChatRoom/ChatRoom.vue";
import { reactive } from "vue";

export interface WebRTCStateModel {
  loadingOpponent: boolean;
  opponentLeft: boolean;
  pairedUpWithOpponent: boolean;
}

export const defaultWebRTCState = () =>
  reactive({
    loadingOpponent: true,
    opponentLeft: false,
    pairedUpWithOpponent: false,
  } as WebRTCStateModel);

// export const resetWebRTCState = () => {
//   defaultWebRTCState.loadingOpponent = true;
//   defaultWebRTCState.opponentLeft = false;
//   defaultWebRTCState.pairedUpWithOpponent = false;
// };

export interface WebRTCModel {
  sendMessage: (msg: string) => void;
  closeWebRtcConnection: () => void;
  restartRTCPeerConnection: () => void;
  webRTCState: WebRTCStateModel;
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

export interface NewMessageModelConverted {
  name: string;
  message: string;
  typing: boolean;
  content: string;
  convertedName: string;
}

export const connectWebRtc = (
  websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>,
  modelEvent: WebRTCEventModel
): Promise<WebRTCModel> => {
  let webRTCState = defaultWebRTCState();
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
  let stream: MediaStream;
  let polite: boolean;
  let makingOffer = false;
  websocketClient.on("onPair", (msg: any) => {

    roomID = msg.id;
    if (mySocket.value === msg.users[0]) {
      polite = true;
    } else {
      polite = false;
    }
    mediaOn();
  });

  websocketClient.on("onPeer", (msg: any) => {

    MatchPlayer(msg);
  });

  function setupChannelAsHost() {
    try {
      channelInstance = pc.createDataChannel("WebRTC_Host");
      channelInstance.onopen = () => {

      };
      channelInstance.onmessage = async (event) => {

        let parsedData: NewMessageModel;
        try {
          parsedData = await JSON.parse(event.data);
          modelEvent.onMessage({
            name: parsedData.name,
            message: parsedData.message,
            typing: parsedData.typing,
            content: parsedData.content,
          });
        } catch (error) {
          console.error("Host parsing error", error);
        }
      };
    } catch (error) {
      console.error("No data channel (peerConnection)", error);
    }
  }

  function setupChannelAsARecipient() {
    pc.ondatachannel = function ({ channel }) {
      channelInstance = channel;
      channelInstance.onopen = function () {

      };

      channelInstance.onmessage = async function (event) {

        let parsedData: NewMessageModel;
        try {
          parsedData = await JSON.parse(event.data);
          modelEvent.onMessage({
            name: parsedData.name,
            message: parsedData.message,
            typing: parsedData.typing,
            content: parsedData.content,
          });
        } catch (error) {
          console.error("Recipient parsing error", error);
        }
      };
      channelInstance.onclose = async function () {

        if (remoteVideo.value) {
          webRTCState.opponentLeft = true;
          remoteVideo.value.srcObject = null;
        }
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

      }
    } catch (err) {
      console.error(err);
    }
  }

  pc.ontrack = ({ track, streams }) => {
    webRTCState.loadingOpponent = false;
    webRTCState.pairedUpWithOpponent = true;
    track.onunmute = () => {
      if (remoteVideo.value) {
        if (remoteVideo.value.srcObject) {
          return;
        }
        remoteVideo.value.srcObject = streams[0];

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

  async function restartRTCPeerConnection() {
    pc = new RTCPeerConnection(config);
  }
  async function closeWebRtcConnection() {
    try {



      stream.getTracks().forEach((track) => {
        track.stop();
        if (myVideo.value) {
          myVideo.value.srcObject = null;
        }
        if (remoteVideo.value) {
          remoteVideo.value.srcObject = null;
        }
      });
      channelInstance.close();
      pc.close();
    } catch (error) {
      console.error("Error when closing webrtc connection", error);
    }
  }
  async function MatchPlayer(data: any) {
    try {


      if (data.description) {

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

        try {

          await pc.addIceCandidate(data.candidate);
        } catch (err) {
          if (!ignoreOffer) {
            // throw err;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  return new Promise((res) =>
    res({
      sendMessage,
      closeWebRtcConnection,
      restartRTCPeerConnection,
      webRTCState,
    })
  );
};
