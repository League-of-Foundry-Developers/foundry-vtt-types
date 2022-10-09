import { expectType } from "tsd";

const doc = new DrawingDocument();

expectType<User | undefined>(doc.author);
