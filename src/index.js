// ** React Imports
import { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom'

// ** Redux Imports
import { Provider } from 'react-redux'
import { store } from './redux/storeConfig/store'

// ** Toast & ThemeColors Context
import { ToastContainer } from 'react-toastify'
import { ThemeContext } from './utility/context/ThemeColors'

// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner'

// ** Ripple Button
import './@core/components/ripple-button'

import { CookiesProvider } from "react-cookie";

// ** PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx.min'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** React Toastify
import '@styles/react/libs/toastify/toastify.scss'

// ** Core styles
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'

// ** Service Worker
import * as serviceWorker from './serviceWorker'

import UserProvider from './providers/UserProvider'

import { hotjar } from 'react-hotjar'

import GA4React from 'ga-4-react'

// import i18n (needs to be bundled ;))
import './i18n';

try {
    setTimeout((_) => {
        const ga4react = new GA4React('G-XS3NGG7FZS')
        ga4react.initialize()
    }, 4000)
} catch (err) {}

hotjar.initialize(2563128, 6)
// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

ReactDOM.render(
    <CookiesProvider>
        <UserProvider>
            <Provider store={store}>
                <Suspense fallback={<Spinner />}>
                    <ThemeContext>
                        <LazyApp />
                        <ToastContainer newestOnTop />
                    </ThemeContext>
                </Suspense>
            </Provider>
        </UserProvider>
    </CookiesProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
