# chat_amigo

[![Backend CI](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_backend.yml/badge.svg)](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_backend.yml)
[![Frontend CI](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_frontend.yml/badge.svg)](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_frontend.yml)

# Advertising
- Look into places to advertise page

# TODO
- ~~Texting in chatroom~~
- ~~Connection with next person~~
    - ~~Working but will produce error, fix it if possible~~
- ~~Provide visual cue that the opponent left the chat~~
- ~~Fill in blank space in homepage~~
- ~~Fix overflow issue with chat when typing long string WITHOUT SPACES~~
- ~~Implement auto scroll on new message~~
- Allow duplicate IP to match others expect for him/herself
    - Remove redirection to main page on same IP detection
- ~~Add notification to let user know webrtc connections has been established (for example in the chat "找到另一個AMIGO了 打個招呼!")~~
- Disable typing until webrtc connection is established (disable, not hide, 下一個 and 離開 button must be available)
## Quality of life
- Add mic and camera switches
- Improve UI with animations/seamlessness
    - Improve opponent left cheft visual cue
    - Add visual cue that opponent has not enabled camera/microphone
- Allow video chat to be used even in use elsewhere
- Better telemetry

# Vue - how to run

```sh
cd frontend-vuejs
npm run dev
```

# Nestjs - how to run
```sh
cd backend-nestjs
npm run start
```