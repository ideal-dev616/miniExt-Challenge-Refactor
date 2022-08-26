const debounce = (fn: (...args: any) => any, timeout: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), timeout);
    };
};

export default debounce;
