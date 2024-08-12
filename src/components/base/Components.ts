
// Абстрактный класс Component, обрабатывающий элементы интерфейса
export abstract class Component<T> {
    // Конструктор принимает элемент контейнера для рендеринга
    protected constructor(protected readonly container: HTMLElement) {}

    // Метод для переключения CSS класса на элементе
    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    // Метод для установки текста внутри элемента
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Метод для установки или снятия состояния 'disabled' у элемента
    setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    // Метод для скрытия элемента
    protected setHidden(element: HTMLElement): void {
        element.style.display = 'none';
    }

    // Метод для отображения элемента
    protected setVisible(element: HTMLElement): void {
        element.style.removeProperty('display');
    }

    // Метод для установки изображения в элементе <img>
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Метод для рендеринга компонента с возможностью передачи данных
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this, data ?? {}); // Присваиваем переданные данные свойствам класса
        return this.container; // Возвращаем контейнер
    }
}