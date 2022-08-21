import { expectType } from "tsd";

expectType<"MeasuredTemplate">(TemplateLayer.documentName);
expectType<TemplateLayer | undefined>(TemplateLayer.instance);
expectType<TemplateLayer.LayerOptions>(TemplateLayer.layerOptions);
expectType<"templates">(TemplateLayer.layerOptions.name);
expectType<typeof MeasuredTemplate>(TemplateLayer.layerOptions.objectClass);
expectType<void>(TemplateLayer.registerSettings());

const layer = new TemplateLayer();
expectType<typeof MeasuredTemplate>(layer.options.objectClass);
expectType<TemplateLayer.LayerOptions>(layer.options);
expectType<"templates">(layer.options.name);
expectType<TemplateLayer>(layer.activate());
expectType<TemplateLayer>(layer.deactivate());
