import { expectType } from 'tsd';

expectType<'MeasuredTemplate'>(TemplateLayer.documentName);
expectType<TemplateLayer>(TemplateLayer.instance);
expectType<TemplateLayer.LayerOptions>(TemplateLayer.layerOptions);
expectType<'templates'>(TemplateLayer.layerOptions.name);
expectType<ConstructorOf<MeasuredTemplate>>(TemplateLayer.layerOptions.objectClass);
expectType<void>(TemplateLayer.registerSettings());

const layer = new TemplateLayer();
expectType<ConstructorOf<MeasuredTemplate>>(layer.options.objectClass);
expectType<TemplateLayer.LayerOptions>(layer.options);
expectType<'templates'>(layer.options.name);
expectType<TemplateLayer>(layer.activate());
expectType<TemplateLayer>(layer.deactivate());
