# chat_amigo

[![Backend CI](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_backend.yml/badge.svg)](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_backend.yml)
[![Frontend CI](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_frontend.yml/badge.svg)](https://github.com/momipochi/taiwan_amigo/actions/workflows/main_frontend.yml)

# TODO
- ~~Texting in chatroom~~
- ~~Connection with next person~~
    - ~~Working but will produce error, fix it if possible~~
- ~~Provide visual cue that the opponent left the chat~~
- ~~Fill in blank space in homepage~~
- Fix overflow issue with chat when typing long string WITHOUT SPACES
- Implement auto scroll on new message
- Remove user from websocket list after disconnection
## If possible
- Improve UI with animations/seamlessness
    - Improve opponent left cheft visual cue
- Allow video chat to be used even in use elsewhere

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