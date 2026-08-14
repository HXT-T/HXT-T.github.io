import SiteFrame from './components/SiteChrome.jsx'
import HomePage from './home/HomePage.jsx'

export default function App() {
  return (
    <SiteFrame current="home" footerIndex="06 / COLOPHON">
      <HomePage />
    </SiteFrame>
  )
}
