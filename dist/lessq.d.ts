declare const lessQuery: ((target?: any) => any) & {
    fn: {
        attr: (this: any, kv: any) => any;
        prop: (this: any, kv: any) => any;
        css: (this: any, kv: any) => any;
        data: (this: any, _kv: any) => any;
        val: (this: any) => any;
        on: (this: any, type: string, listener: any) => any;
        off: (this: any, type: string, listener: any) => any;
        trigger: (type: string, data: any) => /*elided*/ any;
        offset: (this: any) => {
            left: number;
            top: number;
        };
        append: (this: HTMLElement, elms: any) => HTMLElement;
        prepend: (this: HTMLElement, elms: NodeList) => HTMLElement;
        insertBefore: (this: HTMLElement, elms: NodeList) => HTMLElement;
        insertAfter: (this: HTMLElement, elms: NodeList) => HTMLElement;
        remove: (this: HTMLElement) => HTMLElement;
        detach: (this: HTMLElement) => HTMLElement;
        parent: (this: HTMLElement) => any;
        closest: (this: HTMLElement, selector: string) => any;
        find: (this: HTMLElement, selector: string) => any;
        children: (this: HTMLElement, selector: string) => any;
        index: (selector: string) => number;
        clone: (this: HTMLElement) => any;
        focus: () => /*elided*/ any;
        select: () => /*elided*/ any;
        submit: () => /*elided*/ any;
        scrollLeft: () => /*elided*/ any | /*elided*/ any;
        scrollTop: () => /*elided*/ any | /*elided*/ any;
        html: (this: HTMLElement) => string | HTMLElement;
        text: (this: HTMLElement) => string | HTMLElement | null;
        outerWidth: (this: HTMLElement, margin?: boolean) => number;
        innerWidth: (this: HTMLElement) => number;
        width: (this: HTMLElement | Window) => number;
        outerHeight: (this: HTMLElement, margin?: boolean) => number;
        innerHeight: (this: HTMLElement) => number;
        height: (this: HTMLElement | Window) => number;
        addClass: (className: string) => /*elided*/ any;
        removeClass: (className: string) => /*elided*/ any;
        hasClass: (className: string) => boolean;
    };
    extend: <S, T, U extends S & T>(o1: S, o2: T) => U;
    each: (it: any, callback: (i: number | string, o: any) => void) => void;
    grep: (list: any[], accept: (o: any) => boolean) => any[];
    data: (elm: any, kv: any) => any;
    ajax: (params: any) => {
        done: (callback: any) => /*elided*/ any;
        fail: (callback: any) => /*elided*/ any;
        always: (callback: any) => /*elided*/ any;
        abort: () => /*elided*/ any;
    };
};
export default lessQuery;

export { }
