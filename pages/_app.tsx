import type { AppProps } from 'next/app'
import Master from '../components/layouts/Master'

function MyApp({ Component, pageProps }: AppProps) {
  return <Master>
      <Component {...pageProps} />
  </Master>
}

export default MyApp
