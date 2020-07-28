import { Map as ImmutableMap } from 'immutable';
import { forEach } from 'lodash';
import { deepFreeze } from '../../utils';

export abstract class ImmutableRecord<T> {
  protected _data: ImmutableMap<string | number, T> = ImmutableMap<
    string | number,
    T
  >();

  constructor(initialValues?: any) {
    if (initialValues) {
      this._data = this._data.merge(deepFreeze(initialValues));
      forEach(initialValues, (_value, key) => {
        Object.defineProperty(this, key, {
          get() {
            return this._data.get(key);
          },
          set() {
            throw new Error('Cannot set on an immutable record.');
          },
        });
      });
    } else {
      this._data = ImmutableMap<any, any>();
    }
  }

  toJS() {
    return this._data.toJS();
  }

  equals<T>(otherRecord: ImmutableRecord<T>) {
    return (
      typeof this === typeof otherRecord && this._data.equals(otherRecord._data)
    );
  }

  with(values: Partial<T>): T {
    const returnVal = new (this.constructor as any)();
    returnVal._data = this._data.merge(deepFreeze(values as any));
    return returnVal;
  }
}
