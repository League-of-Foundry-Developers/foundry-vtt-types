import { expectType } from 'tsd';

expectType<foundry.data.ChatMessageData>(new foundry.data.ChatMessageData());
expectType<foundry.data.ChatMessageData>(new foundry.data.ChatMessageData({}));
expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    blind: null,
    content: null,
    emote: null,
    flags: null,
    flavor: null,
    roll: null,
    sound: null,
    speaker: null,
    timestamp: null,
    type: null,
    user: null,
    whisper: null,
    _id: null
  })
);
expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    blind: undefined,
    content: undefined,
    emote: undefined,
    flags: undefined,
    flavor: undefined,
    roll: undefined,
    sound: undefined,
    speaker: undefined,
    timestamp: undefined,
    type: undefined,
    user: undefined,
    whisper: undefined,
    _id: undefined
  })
);

expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: null
    }
  })
);
expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    speaker: {}
  })
);
expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    speaker: {
      scene: undefined,
      actor: undefined,
      token: undefined,
      alias: undefined
    }
  })
);

expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    whisper: null
  })
);
expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    whisper: ['someId']
  })
);
expectType<foundry.data.ChatMessageData>(
  new foundry.data.ChatMessageData({
    whisper: [{ id: 'someId' }]
  })
);
