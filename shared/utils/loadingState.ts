export type LoadingState<T> =
    | {
          type: 'notLoaded'; // hasn't been initiated
      }
    | {
          type: 'loading';
      }
    | {
          type: 'loaded';
          data: T;
          errorMessage?: string; // The latest call failed, but we have previous data that we can use.
      }
    | {
          type: 'failed';
          errorMessage: string;
      };
