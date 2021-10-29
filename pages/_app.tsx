import type { AppProps } from 'next/app'
import Head from 'next/head'

import ContextWrapper from '../context'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="services down monitoring" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>

      <ContextWrapper>
        <Component {...pageProps} />
      </ContextWrapper>
    </>
  )
}
export default MyApp
