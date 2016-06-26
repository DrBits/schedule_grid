declare type Getter<T> = (ID) => T

export default class Cache<ID, T> {
  private getter: Getter<T>

  private cache: {ID: T}

  constructor(getter: Getter<T>) {
    this.getter = getter
    this.cache = <{ID: T}>{}
  }

  set: (ID, T) => void = (id, t) => this.cache[id] = t
  
  get: (ID) => T = id => {
    if (!this.has(id)) {
      const v = this.getter(id)
      this.cache[id] = v
    }
    return this.cache[id]
  } 

  has: (ID) => boolean = id => id in this.cache
  
  invalidate: (ID) => void = id => delete this.cache[id]
}