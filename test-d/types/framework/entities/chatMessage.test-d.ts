import { expectType } from 'tsd';
import '../../../../index';

expectType<ChatMessage.SpeakerData>(ChatMessage.getSpeaker());
expectType<ChatMessage.SpeakerData>(ChatMessage.getSpeaker({}));
expectType<ChatMessage.SpeakerData>(ChatMessage.getSpeaker({ actor: new Actor() }));
expectType<ChatMessage.SpeakerData>(ChatMessage.getSpeaker({ scene: new Scene() }));
expectType<ChatMessage.SpeakerData>(ChatMessage.getSpeaker({ token: new Token() }));
expectType<ChatMessage.SpeakerData>(ChatMessage.getSpeaker({ alias: 'Some Alias' }));
