import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RsvpCodeEntry from './pages/rsvp/RsvpCodeEntry'
import RsvpForm from './pages/rsvp/RsvpForm'
import RsvpConfirmation from './pages/rsvp/RsvpConfirmation'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/rsvp" element={<RsvpCodeEntry />} />
      <Route path="/rsvp/form" element={<RsvpForm />} />
      <Route path="/rsvp/merci" element={<RsvpConfirmation />} />
    </Routes>
  )
}

export default App
