import { expectError, expectType } from 'tsd';
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
expectType<boolean>(baseUser.hasRole('NONE'));
expectType<boolean>(baseUser.hasRole('PLAYER'));
expectType<boolean>(baseUser.hasRole('TRUSTED'));
expectType<boolean>(baseUser.hasRole('ASSISTANT'));
expectType<boolean>(baseUser.hasRole('GAMEMASTER'));

expectType<boolean>(baseUser.hasRole(CONST.USER_ROLES.NONE));
expectType<boolean>(baseUser.hasRole(CONST.USER_ROLES.PLAYER));
expectType<boolean>(baseUser.hasRole(CONST.USER_ROLES.TRUSTED));
expectType<boolean>(baseUser.hasRole(CONST.USER_ROLES.ASSISTANT));
expectType<boolean>(baseUser.hasRole(CONST.USER_ROLES.GAMEMASTER));

expectError(baseUser.hasRole('ACTOR_CREATE'));
expectError(baseUser.hasRole(-1));
expectError(baseUser.hasRole(100));

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

expectError(baseUser.can(-1));
expectError(baseUser.can(100));
expectError(baseUser.can('SHOW_RULERS'));

expectType<boolean>(baseUser.hasPermission('ACTOR_CREATE'));
expectType<boolean>(baseUser.hasPermission('BROADCAST_AUDIO'));
expectType<boolean>(baseUser.hasPermission('BROADCAST_VIDEO'));
expectType<boolean>(baseUser.hasPermission('DRAWING_CREATE'));
expectType<boolean>(baseUser.hasPermission('ITEM_CREATE'));
expectType<boolean>(baseUser.hasPermission('FILES_BROWSE'));
expectType<boolean>(baseUser.hasPermission('FILES_UPLOAD'));
expectType<boolean>(baseUser.hasPermission('JOURNAL_CREATE'));
expectType<boolean>(baseUser.hasPermission('MACRO_SCRIPT'));
expectType<boolean>(baseUser.hasPermission('MESSAGE_WHISPER'));
expectType<boolean>(baseUser.hasPermission('NOTE_CREATE'));
expectType<boolean>(baseUser.hasPermission('SETTINGS_MODIFY'));
expectType<boolean>(baseUser.hasPermission('SHOW_CURSOR'));
expectType<boolean>(baseUser.hasPermission('SHOW_RULER'));
expectType<boolean>(baseUser.hasPermission('TEMPLATE_CREATE'));
expectType<boolean>(baseUser.hasPermission('TOKEN_CREATE'));
expectType<boolean>(baseUser.hasPermission('TOKEN_CONFIGURE'));
expectType<boolean>(baseUser.hasPermission('WALL_DOORS'));

expectError(baseUser.hasPermission('GAMEMASTER'));
expectError(baseUser.hasPermission(CONST.USER_ROLES.GAMEMASTER));
expectError(baseUser.hasPermission(10));
expectError(baseUser.hasPermission('SHOW_RULERS'));
