import { Suspense, lazy } from 'react'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { CookiesProvider } from "react-cookie";
// ** Spinner (Splash Screen)
import Spinner from './views/components/spinner/Fallback-spinner'
// import { hotjar } from 'react-hotjar'   Temporary comment out Feedback feature

import GA4React from 'ga-4-react'


import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import UserProvider from './providers/UserProvider'
import './i18n';
import './assets/scss/style.scss'

try {
  setTimeout((_) => {
      const ga4react = new GA4React('G-XS3NGG7FZS')
      ga4react.initialize()
  }, 4000)
} catch (err) {}

// hotjar.initialize(2563128, 6)       Temporary comment out Feedback feature
// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
        <UserProvider>
            {/* <Provider store={store}> */}
                <Suspense fallback={<Spinner />}>
                    {/* <ThemeContext> */}
                        <LazyApp />
                        <ToastContainer newestOnTop />
                    {/* </ThemeContext> */}
                </Suspense>
            {/* </Provider> */}
        </UserProvider>
    </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
