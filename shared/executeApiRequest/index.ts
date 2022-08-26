import 'isomorphic-fetch';
import { v1APIRoute } from '../api/routes';

export type ExecuteApiRequestResult<Output> =
    | {
          type: 'success';
          data: Output;
          errorMessage?: string; // The latest call failed, but we have previous data that we can use.
      }
    | { type: 'error'; message: string };

export const executeApiRequest = async <Input, Output>(args: {
    route: v1APIRoute;
    body: Input;
    method?: 'POST' | 'GET';
    source:
        | { type: 'marketplace'; domain: string; sessionCookie: string | null }
        | {
              type: 'website';
          };
}): Promise<ExecuteApiRequestResult<Output>> => {
    try {
        const method = args.method ?? 'POST';
        const url = `${
            args.source.type === 'marketplace'
                ? args.source.domain
                : process.env.NODE_ENV !== 'production'
                ? 'http://localhost:3000'
                : ''
        }/api/v1?route=${encodeURIComponent(args.route)}`;

        const bodyWithExtras: Input = args.body;

        const body = bodyWithExtras
            ? JSON.stringify(bodyWithExtras) ?? null
            : null;

        const response = await fetch(url, {
            method,
            ...(body ? { body } : {}),
        }).catch((e) => {
            throw e;
        });

        if (response && response.ok) {
            const data = await response.json();

            if (data.error) {
                throw new Error(data.message);
            } else {
                return {
                    type: 'success',
                    data,
                };
            }
        } else {
            throw new Error('Request failed. Please try again.');
        }
    } catch (e) {
        return {
            type: 'error',
            message: e.message,
        };
    }
};
