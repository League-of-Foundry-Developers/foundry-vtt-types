import 'jquery';
import 'socket.io-client';
import 'tinymce';

// Apps

import './types/applications/application';
import './types/applications/baseEntitySheet';
import './types/applications/cameraViews';
import './types/applications/formApplication';
import './types/applications/formDataExtended';
import './types/applications/localization';

import './types/applications/forms/actor';
import './types/applications/forms/forms';
import './types/applications/forms/item';
import './types/applications/forms/permission';
import './types/applications/forms/rollTableConfig';
import './types/applications/forms/scene';
import './types/applications/forms/setupConfigurationForm';
import './types/applications/forms/userManagement';

import './types/applications/hud/chatBubbles';
import './types/applications/hud/container';
import './types/applications/hud/controls';
import './types/applications/hud/hotbar';
import './types/applications/hud/hud';
import './types/applications/hud/menu';
import './types/applications/hud/navigation';
import './types/applications/hud/pause';
import './types/applications/hud/players';

import './types/applications/journal/journalSheet';
import './types/applications/journal/noteConfig';

import './types/applications/placeables/placeablesConfig';
import './types/applications/placeables/placeablesHud';

import './types/applications/sidebar/applications/actorDirectory';
import './types/applications/sidebar/applications/chatLog';
import './types/applications/sidebar/applications/clientSettings';
import './types/applications/sidebar/applications/combatTracker';
import './types/applications/sidebar/applications/compendiumDirectory';
import './types/applications/sidebar/applications/itemDirectory';
import './types/applications/sidebar/applications/journalDirectory';
import './types/applications/sidebar/applications/macroDirectory';
import './types/applications/sidebar/applications/playlistDirectory';
import './types/applications/sidebar/applications/rollTableDirectory';
import './types/applications/sidebar/applications/sceneDirectory';
import './types/applications/sidebar/applications/settings';

import './types/applications/sidebar/sidebar';
import './types/applications/sidebar/sidebarDirectory';
import './types/applications/sidebar/sidebarTab';

import './types/applications/widgets/searchFilter';

// Augments

import './types/augments/PIXI';
import './types/augments/handlebars';
import './types/augments/howler';
import './types/augments/tinyMCE';
import './types/augments/utility-types';

// Core

import './types/core/audioHelper';
import './types/core/config';
import './types/core/fonts';
import './types/core/gameTime';
import './types/core/handlebarsHelpers';
import './types/core/hooks';
import './types/core/imageHelper';
import './types/core/keyboardManager';
import './types/core/setupConfiguration';
import './types/core/socketInterface';
import './types/core/sortingHelpers';
import './types/core/textEditor';
import './types/core/videoHelper';

// rolls

import './types/core/rolls/dicePool';
import './types/core/rolls/roll';

// dice terms

import './types/core/rolls/diceTerms/coin';
import './types/core/rolls/diceTerms/diceTerm';
import './types/core/rolls/diceTerms/die';
import './types/core/rolls/diceTerms/fateDie';

// settings

import './types/core/settings/clientSettings';
import './types/core/settings/worldSettingsStorage';

// webRTC

import './types/core/webRtc/avMaster';
import './types/core/webRtc/avSettings';

// Framework

import './types/framework/collection';
import './types/framework/compendium';
import './types/framework/entity';
import './types/framework/entityCollection';

import './types/framework/entities/actor';
import './types/framework/entities/chatMessage';
import './types/framework/entities/combat';
import './types/framework/entities/embeddedEntity';
import './types/framework/entities/folder';
import './types/framework/entities/item';
import './types/framework/entities/journal';
import './types/framework/entities/macro';
import './types/framework/entities/playlist';
import './types/framework/entities/rollTable';
import './types/framework/entities/scene';
import './types/framework/entities/user';

// PIXI

import './types/pixi/canvas';
import './types/pixi/canvasLayer';
import './types/pixi/lightingLayer';
import './types/pixi/measuredTemplate';
import './types/pixi/mouseInteractionManager';
import './types/pixi/normalizedRectangle';
import './types/pixi/placeablesLayer';
import './types/pixi/pointSource';
import './types/pixi/quadtree';
import './types/pixi/sightLayer';
import './types/pixi/textureLoader';

import './types/pixi/helpers/controlIcon';
import './types/pixi/helpers/ray';
import './types/pixi/helpers/ruler';

import './types/pixi/placeableObjects/note';
import './types/pixi/placeableObjects/placeableObject';
import './types/pixi/placeableObjects/tile';
import './types/pixi/placeableObjects/token';
import './types/pixi/placeableObjects/wall';

// UI

import './types/ui/activeEffectConfig';
import './types/ui/context';
import './types/ui/dialog';
import './types/ui/dragDrop';
import './types/ui/filePicker';
import './types/ui/notifications';
import './types/ui/tabs';

// --

import './types/constants';
import './types/game';
import './types/handlebars';
import './types/mersenneTwister';
import './types/prototypes';
import './types/templateUtils';
import './types/types';
import './types/utils';
