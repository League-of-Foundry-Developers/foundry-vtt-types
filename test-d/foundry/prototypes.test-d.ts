import { expectType } from 'tsd';
import '../../index';

expectType<'Foo'>('foo'.capitalize());
expectType<'FOO'>('FOO'.capitalize());
expectType<'Foo bar'>('foo bar'.capitalize());
expectType<'FOO BAR'>('FOO BAR'.capitalize());

expectType<'Foo'>('foo'.titleCase());
expectType<'Foo'>('FOO'.titleCase());
expectType<'Foo Bar'>('foo bar'.titleCase());
expectType<'Foo Bar'>('FOO BAR'.titleCase());
