import { FaasFunction } from './faasfunction';
import { v4 as uuid } from 'uuid';

export class FaasFunctionExecution {
  constructor(private readonly _functionId: string,
              private _finished: boolean = false,
              private readonly _id: string = uuid()) {
  }


  static of(func: FaasFunction): FaasFunctionExecution {
    return new FaasFunctionExecution(func.id, false, null);
  }

  finish(): void {
    this._finished = true;
  }


  get functionId(): string {
    return this._functionId;
  }

  get finished(): boolean {
    return this._finished;
  }

  get id(): string {
    return this._id;
  }


  set finished(value: boolean) {
    this._finished = value;
  }
}