import { IEvents } from './events';

export const isModel = <T>(obj: unknown): obj is Model<T> => {
	return obj instanceof Model;
};

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
