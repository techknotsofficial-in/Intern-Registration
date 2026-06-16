import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Programs from './components/Programs'
import Benefits from './components/Benefits'
import InternshipDetails from './components/InternshipDetails'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import RegistrationForm from './components/RegistrationForm'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Programs />
      <Benefits />
      <InternshipDetails />
      <Stats />
      <Testimonials />
      <RegistrationForm />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App
