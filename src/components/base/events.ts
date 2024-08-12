type EventName = string | RegExp;
type Subscriber = Function;

// Определение события, которое будет передаваться через экземпляр Emitter
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

// Интерфейс для реализации событийной системы
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Класс EventEmitter для обработки событий
export class EventEmitter implements IEvents {
    private _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    // Подписка на событие
    on<T extends object>(eventName: EventName, callback: (event: T) => void): void {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    // Отмена подписки на событие
    off(eventName: EventName, callback: Subscriber): void {
        if (this._events.has(eventName)) {
            const subscribers = this._events.get(eventName)!;
            subscribers.delete(callback);

            // Удаление события, если больше нет подписчиков
            if (subscribers.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    // Генерация события и уведомление всех подписчиков
    emit<T extends object>(eventName: string, data?: T): void {
        this._events.forEach((subscribers, name) => {
            // Проверка на соответствие имени события либо регулярному выражению
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    // Подписка на все события
    onAll(callback: (event: EmitterEvent) => void): void {
        this.on("*", callback);
    }

    // Отмена всех подписок
    offAll(): void {
        this._events.clear();
    }

    // Генерация функции триггера для события с контекстом
    trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void {
        return (data: T = {} as T): void => {
            this.emit(eventName, {
                ...(data || {}),
                ...(context || {})
            });
        };
    }
}