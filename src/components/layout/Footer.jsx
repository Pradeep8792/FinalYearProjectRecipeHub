import { FiFacebook, FiInstagram, FiMail, FiTwitter } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { GiCookingPot } from 'react-icons/gi'

function Footer() {
  return (
    <footer className="mt-20 bg-orange-500 text-white">
      <div className="container-app py-14 text-center">
        <div className="flex items-center justify-center gap-3">
          <GiCookingPot className="text-4xl" />
          <h3 className="text-4xl font-extrabold">RecipeHub</h3>
        </div>
        <p className="mt-4 text-orange-50">Simple • Elegant • Delicious</p>

        <h4 className="mt-10 text-3xl font-bold">Connect with US</h4>
        <div className="mt-6 flex items-center justify-center gap-6 text-3xl">
          <a href="#" className="transition hover:scale-110"><FiFacebook /></a>
          <a href="#" className="transition hover:scale-110"><FiInstagram /></a>
          <a href="#" className="transition hover:scale-110"><FiTwitter /></a>
          <a href="#" className="transition hover:scale-110"><FiMail /></a>
          <a href="#" className="transition hover:scale-110"><FaWhatsapp /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
