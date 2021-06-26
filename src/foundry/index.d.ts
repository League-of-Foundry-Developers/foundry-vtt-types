import './common/module.mjs';

import './foundry.js/actorTokenHelpers';
import './foundry.js/application';
import './foundry.js/audioHelper';
import './foundry.js/avClient';
import './foundry.js/avMaster';
import './foundry.js/avSettings';
import './foundry.js/cameraPopoutAppWrapper';
import './foundry.js/canvas';
import './foundry.js/canvasAnimation';
import './foundry.js/canvasDocumentMixin';
import './foundry.js/chatBubbles';
import './foundry.js/clientDocumentMixin';
import './foundry.js/clientSettings';
import './foundry.js/config';
import './foundry.js/constants';
import './foundry.js/contextMenu';
import './foundry.js/dragDrop';
import './foundry.js/draggable';
import './foundry.js/entity';
import './foundry.js/features';
import './foundry.js/fonts';
import './foundry.js/formDataExtended';
import './foundry.js/game';
import './foundry.js/gameTime';
import './foundry.js/globalVariables';
import './foundry.js/handlebarsHelpers';
import './foundry.js/hooks';
import './foundry.js/imageHelper';
import './foundry.js/keyboardManager';
import './foundry.js/localization';
import './foundry.js/mersenneTwister';
import './foundry.js/mouseInteractionManager';
import './foundry.js/pointSource';
import './foundry.js/prototypes';
import './foundry.js/quadtree';
import './foundry.js/ray';
import './foundry.js/roll';
import './foundry.js/searchFilter';
import './foundry.js/specialEffect';
import './foundry.js/socketInterface';
import './foundry.js/sortingHelpers';
import './foundry.js/tabs';
import './foundry.js/templateUtils';
import './foundry.js/textEditor';
import './foundry.js/textureLoader';
import './foundry.js/textureUtils';
import './foundry.js/types';
import './foundry.js/userTargets';
import './foundry.js/utils';
import './foundry.js/videoHelper';

import './foundry.js/applications';

import './foundry.js/avClients/easyRTCClient';

import './foundry.js/clientDocuments/activeEffect';
import './foundry.js/clientDocuments/actor';
import './foundry.js/clientDocuments/canvasDocuments/ambientLightDocument';
import './foundry.js/clientDocuments/canvasDocuments/drawingDocument';
import './foundry.js/clientDocuments/canvasDocuments/measuredTemplateDocument';
import './foundry.js/clientDocuments/canvasDocuments/tokenDocument';
import './foundry.js/clientDocuments/chatMessage';
import './foundry.js/clientDocuments/combat';
import './foundry.js/clientDocuments/combatant';
import './foundry.js/clientDocuments/folder';
import './foundry.js/clientDocuments/item';
import './foundry.js/clientDocuments/journalEntry';
import './foundry.js/clientDocuments/macro';
import './foundry.js/clientDocuments/playlist';
import './foundry.js/clientDocuments/rollTable';
import './foundry.js/clientDocuments/scene';
import './foundry.js/clientDocuments/setting';
import './foundry.js/clientDocuments/user';

import './foundry.js/collections';

import './foundry.js/rollTerm';

import './foundry.js/rollTerms/diceTerm';
import './foundry.js/rollTerms/mathTerm';
import './foundry.js/rollTerms/numericTerm';
import './foundry.js/rollTerms/operatorTerm';
import './foundry.js/rollTerms/parentheticalTerm';
import './foundry.js/rollTerms/poolTerm';
import './foundry.js/rollTerms/stringTerm';

import './foundry.js/rollTerms/diceTerms/coin';
import './foundry.js/rollTerms/diceTerms/die';
import './foundry.js/rollTerms/diceTerms/fateDie';

import './foundry.js/embeddedEntities/activeEffect';

import './foundry.js/entities/actor';
import './foundry.js/entities/chatMessage';
import './foundry.js/entities/combat';
import './foundry.js/entities/item';
import './foundry.js/entities/playlist';
import './foundry.js/entities/rollTable';
import './foundry.js/entities/scene';
import './foundry.js/entities/user';

import './foundry.js/pixi/blendModes';

import './foundry.js/pixi/containers/baseGrid';
import './foundry.js/pixi/containers/cachedContainer';
import './foundry.js/pixi/containers/canvasLayer';
import './foundry.js/pixi/containers/controlIcon';
import './foundry.js/pixi/containers/cursor';
import './foundry.js/pixi/containers/doorControl';
import './foundry.js/pixi/containers/placeableObject';
import './foundry.js/pixi/containers/ruler';

import './foundry.js/pixi/containers/baseGrids/hexagonalGrid';
import './foundry.js/pixi/containers/baseGrids/squareGrid';

import './foundry.js/pixi/containers/canvasLayers/controlsLayer';
import './foundry.js/pixi/containers/canvasLayers/effectsLayer';
import './foundry.js/pixi/containers/canvasLayers/gridLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayer';
import './foundry.js/pixi/containers/canvasLayers/sightLayer';

import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/drawingsLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/lightingLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/mapLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/mapLayers/backgroundLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/mapLayers/foregroundLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/notesLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/soundsLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/templateLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/tilesLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/tokenLayer';
import './foundry.js/pixi/containers/canvasLayers/placeablesLayers/wallsLayer';

import './foundry.js/pixi/containers/placeableObjects/ambientLight';
import './foundry.js/pixi/containers/placeableObjects/ambientSound';
import './foundry.js/pixi/containers/placeableObjects/drawing';
import './foundry.js/pixi/containers/placeableObjects/measuredTemplate';
import './foundry.js/pixi/containers/placeableObjects/note';
import './foundry.js/pixi/containers/placeableObjects/tile';
import './foundry.js/pixi/containers/placeableObjects/token';
import './foundry.js/pixi/containers/placeableObjects/wall';

import './foundry.js/pixi/graphics/gridHighlight';
import './foundry.js/pixi/graphics/resizeHandle';

import './foundry.js/pixi/rectangles/normalizedRectangle';

import './foundry.js/pixi/shaders/abstractBaseShader';

import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShader';

import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/chromaColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/emanationColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/energyFieldColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/fogColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/ghostLightColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/hexaDomeColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/lightDomeColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/pulseColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/sunburstColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/torchColorationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardColorationShaders/waveColorationShader';

import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/blackHoleIlluminationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/ghostLightIlluminationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/pulseIlluminationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/roilingIlluminationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/sunburstIlluminationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/torchIlluminationShader';
import './foundry.js/pixi/shaders/abstractBaseShaders/standardIlluminationShaders/waveIlluminationShader';

import './foundry.js/pixi/texts/preciseText';

import './foundry.js/specialEffects/autumnLeavesWeatherEffect';
import './foundry.js/specialEffects/rainWeatherEffect';
import './foundry.js/specialEffects/snowWeatherEffect';
