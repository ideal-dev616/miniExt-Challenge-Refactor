/**
 * Generate a random string
 */
const makeId = (
    length: number = 10,
    includeLetters: boolean = true
): string => {
    let result = '';

    const characters = includeLetters
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        : '0123456789';

    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

export default makeId;
