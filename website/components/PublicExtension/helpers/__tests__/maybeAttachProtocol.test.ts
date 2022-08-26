import { maybeAttachProtocol } from '../maybeAttachProtocol';

describe('maybeAttachProtocol helper', () => {
    it('should attach protocol if absent', () => {
        const input = 'miniextensions.com';
        const output = 'https://miniextensions.com';
        expect(maybeAttachProtocol(input)).toEqual(output);
    });

    it('should return orginal url if it starts with http://', () => {
        const input = 'http://miniextensions.com';
        expect(maybeAttachProtocol(input)).toEqual(input);
    });

    it('should return original url if it starts with https://', () => {
        const input = 'http://miniextensions.com';
        expect(maybeAttachProtocol(input)).toEqual(input);
    });
});
