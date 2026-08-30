import { RouterProvider } from 'react-router-dom'
import router from './routes'
import HeroSection from './components/landing/HeroSection'

function App() {
  return (

    <>
    <HeroSection />      
  <RouterProvider router={router} />

  </>
  )

}

export default App