import type { AppProps } from 'next/app';
import '../styles/tailwind.css';
import '../styles/react-datetime.css';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorMessage from '../components/reusables/ErrorMessage';
import { Helmet } from 'react-helmet';
import { logError } from '../utils/logError';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

const MyApp = ({ Component, pageProps }: AppProps) => (
    <Provider store={store}>
        <ErrorBoundary
            fallbackRender={() => (
                <div style={{ padding: 16 }}>
                    <ErrorMessage
                        message={
                            'Sorry! There was an error. Please try refreshing the page. If you still see this, please contact us in the chat.'
                        }
                    />
                </div>
            )}
            onError={(error: any) =>
                logError({
                    error,
                    extensionId: null,
                })
            }
        >
            <Helmet defer={true}>
                <title>{'miniExtensions'}</title>
            </Helmet>
            <Component {...pageProps} />
        </ErrorBoundary>
    </Provider>
);
export default MyApp;
