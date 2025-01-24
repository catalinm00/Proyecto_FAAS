import { Observable } from 'rxjs';
import { Event } from './event';

export interface Subscriber<T extends Event> {
  subscribe(topic: string): Observable<T>;
}
