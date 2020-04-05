import { Key } from 'readline';
import { BehaviorSubject } from 'rxjs';

export class ObservableMap<K, V> extends Map<K, V> {
  private subjects: Map<K, BehaviorSubject<V>> = new Map();

  public getSubscription(key: K) {
    this.getBehaviourSubject(key).asObservable();
  }

  private getBehaviourSubject(key: K) {
    if (this.subjects.has(key)) return this.subjects.get(key);
    return this.subjects.set(key, new BehaviorSubject(undefined)).get(key);
  }

  public set(key: K, value: V) {
    super.set(key, value);

    this.getBehaviourSubject(key).next(value);

    return this;
  }

  public delete(key: K) {
    const result = super.delete(key);

    this.getBehaviourSubject(key).next(undefined);
    this.subjects.delete(key);

    return result;
  }
}
