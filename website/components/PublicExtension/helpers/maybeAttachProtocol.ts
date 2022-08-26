export const maybeAttachProtocol = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://'))
        return `https://${url}`;
    return url;
};
