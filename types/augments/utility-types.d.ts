// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as utility from 'utility-types';

declare global {
  type Optional<T extends object, K extends keyof T = keyof T> = utility.Optional<T, K>;
}
