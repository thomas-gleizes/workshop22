import { useEffect } from "react"
import { AppProps } from "next/app"

import "styles/global.css"

const MyApp: Component<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    document && document.documentElement.setAttribute("data-theme", "bumblebee")
  }, [])

  return (
    <div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
