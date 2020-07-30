import { Freezed } from './models/base/freezed.model';

/**
 * @param  {string} message? - the message to log
 * @param  {any} value? - the value to log
 */
export const log = (message?: string, value?: any) => {
  const shouldLog = true;
  if (shouldLog) {
    if (value) {
      console.log(message, value);
    } else {
      console.log(message);
    }
  }
};

/**
 * @param  {T} source - the source object
 * @param  {} freezeParent=true - whether to freeze the parent or not
 * @returns Freezed - the object that has been freezed
 */
export const deepFreeze = <T>(source: T, freezeParent = true): Freezed<T> => {
  if (freezeParent) Object.freeze(source);

  Object.getOwnPropertyNames(source).forEach(function (prop) {
    if (
      Object.prototype.hasOwnProperty.call(source as any, prop) &&
      (source as any)[prop] !== null &&
      (typeof (source as any)[prop] === 'object' ||
        typeof (source as any)[prop] === 'function')
    ) {
      if (Object.isFrozen((source as any)[prop])) {
        deepFreeze((source as any)[prop], false);
      } else {
        deepFreeze((source as any)[prop], true);
      }
    }
  });

  return source as Freezed<T>;
};

/**
 * Randomize array in-place using Durstenfeld shuffle algorithm
 * @param  {Array<T>} array - the array to suffle
 */
export const shuffleArray = <T>(array: Array<T>): T[] => {
  const copyArray = [...array];
  for (let i = copyArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    const temp = copyArray[i];
    copyArray[i] = copyArray[j];
    copyArray[j] = temp;
  }
  return copyArray;
};
