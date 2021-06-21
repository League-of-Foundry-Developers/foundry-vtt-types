import { expectType } from 'tsd';
import { BaseUser } from '../../../../src/foundry/common/documents.mjs';
import { ConfiguredDocumentClass } from '../../../../src/types/helperTypes';

expectType<Promise<InstanceType<ConfiguredDocumentClass<typeof User>>>>(foundry.documents.BaseUser.create());
expectType<Promise<InstanceType<ConfiguredDocumentClass<typeof User>>[]>>(
  foundry.documents.BaseUser.createDocuments([])
);
expectType<Promise<InstanceType<ConfiguredDocumentClass<typeof User>>[]>>(
  foundry.documents.BaseUser.updateDocuments([])
);
expectType<Promise<InstanceType<ConfiguredDocumentClass<typeof User>>[]>>(
  foundry.documents.BaseUser.deleteDocuments([])
);

const user = await foundry.documents.BaseUser.create();
expectType<foundry.data.UserData>(user.data);

const baseUser = new BaseUser();
expectType<boolean>(baseUser.can('NONE'));
expectType<boolean>(baseUser.can('PLAYER'));
expectType<boolean>(baseUser.can('TRUSTED'));
expectType<boolean>(baseUser.can('ASSISTANT'));
expectType<boolean>(baseUser.can('GAMEMASTER'));

expectType<boolean>(baseUser.can(CONST.USER_ROLES.NONE));
expectType<boolean>(baseUser.can(CONST.USER_ROLES.PLAYER));
expectType<boolean>(baseUser.can(CONST.USER_ROLES.TRUSTED));
expectType<boolean>(baseUser.can(CONST.USER_ROLES.ASSISTANT));
expectType<boolean>(baseUser.can(CONST.USER_ROLES.GAMEMASTER));

expectType<boolean>(baseUser.can('ACTOR_CREATE'));
expectType<boolean>(baseUser.can('BROADCAST_AUDIO'));
expectType<boolean>(baseUser.can('BROADCAST_VIDEO'));
expectType<boolean>(baseUser.can('DRAWING_CREATE'));
expectType<boolean>(baseUser.can('ITEM_CREATE'));
expectType<boolean>(baseUser.can('FILES_BROWSE'));
expectType<boolean>(baseUser.can('FILES_UPLOAD'));
expectType<boolean>(baseUser.can('JOURNAL_CREATE'));
expectType<boolean>(baseUser.can('MACRO_SCRIPT'));
expectType<boolean>(baseUser.can('MESSAGE_WHISPER'));
expectType<boolean>(baseUser.can('NOTE_CREATE'));
expectType<boolean>(baseUser.can('SETTINGS_MODIFY'));
expectType<boolean>(baseUser.can('SHOW_CURSOR'));
expectType<boolean>(baseUser.can('SHOW_RULER'));
expectType<boolean>(baseUser.can('TEMPLATE_CREATE'));
expectType<boolean>(baseUser.can('TOKEN_CREATE'));
expectType<boolean>(baseUser.can('TOKEN_CONFIGURE'));
expectType<boolean>(baseUser.can('WALL_DOORS'));
