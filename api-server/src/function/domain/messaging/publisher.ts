import { Event } from './event';

export interface Publisher<T extends Event> {
  publish(event: T): Promise<void>;
}
