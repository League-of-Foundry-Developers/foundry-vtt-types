import { expectType } from 'tsd';

expectType<Promise<StoredDocument<ChatMessage> | undefined>>(foundry.documents.BaseChatMessage.create({}));
expectType<Promise<StoredDocument<ChatMessage>[]>>(foundry.documents.BaseChatMessage.createDocuments([]));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.updateDocuments([]));
expectType<Promise<ChatMessage[]>>(foundry.documents.BaseChatMessage.deleteDocuments([]));

const chat = await foundry.documents.BaseChatMessage.create({}, { temporary: true });
if (chat) {
  expectType<foundry.documents.BaseChatMessage['data']>(chat.data);
}

expectType<foundry.documents.BaseChatMessage>(new foundry.documents.BaseChatMessage());
expectType<foundry.documents.BaseChatMessage>(new foundry.documents.BaseChatMessage({}));
expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
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
expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
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

expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: null
    }
  })
);
expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
    speaker: {}
  })
);
expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
    speaker: {
      scene: undefined,
      actor: undefined,
      token: undefined,
      alias: undefined
    }
  })
);

expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
    whisper: null
  })
);
expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
    whisper: ['someId']
  })
);
expectType<foundry.documents.BaseChatMessage>(
  new foundry.documents.BaseChatMessage({
    whisper: [{ id: 'someId' }]
  })
);
