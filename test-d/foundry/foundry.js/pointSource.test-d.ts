import { expectType } from 'tsd';

const pointSource = new PointSource(new Token(new TokenDocument()), 'sight');
expectType<[number, number, number] | undefined>(pointSource.colorRGB);
const initializedPointSource = pointSource.initialize();
expectType<[number, number, number]>(initializedPointSource.colorRGB);
