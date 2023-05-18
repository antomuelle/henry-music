import '../styles/landing.css'
import logo from '../assets/logo.png'
import pod1 from '../assets/pod1.png'
import pod2 from '../assets/pod2.png'
import pod3 from '../assets/pod3.png'
import draw from '../assets/rude-henry.jpg'
import antonio from '../assets/team/antonio.jpg'
import abi from '../assets/team/abi.jpg'
import agus from '../assets/team/agus.jpg'
import bianchi from '../assets/team/bianchi.jpg'
import carlos from '../assets/team/carlos.jpg'
import erick from '../assets/team/erick.jpg'
import felipe from '../assets/team/felipe.jpg'
import rodolfo from '../assets/team/rodolfo.jpg'
import yt from '../assets/yt.png'
import github from '../assets/github.png'
import fb from '../assets/fb.png'
import countries from '../assets/countries.png'
import { useAuth0 } from "@auth0/auth0-react"

export default function Landing() {
  const { loginWithRedirect } = useAuth0()

  return (
  <div className=' landing'>
    <div className="_limiter-hd header">
      <div className="_flex logo">
        <img src={logo} alt="Henry logo" />
        <div className='_flex-vcenter'><h2><span className='_font-300'>Henry</span> Music</h2></div>
      </div>
      <div className="nav">
        <a href="#aboutus">¿Quienes somos?</a>
        <button onClick={() => loginWithRedirect()}>LogIn</button>
      </div>
    </div>
    <div className="grad">
      <h1>Why switch to Henry Music?</h1>
    </div>
    <div className="_limiter-hd _columns pods">
      <div className='_column'>
        <img src={pod1} alt="" />
        <h6>Listen ad-free music</h6>
        <p>Enjoy your no-stops music</p>
      </div>
      <div className='_column'>
        <img src={pod3} alt="" />
        <h6>Play any song you want</h6>
        <p>Even on your phone</p>
      </div>
      <div className='_column'>
        <img src={pod2} alt="" />
        <h6>Unlimited skips</h6>
        <p>Just play next</p>
      </div>
    </div>

    <div className="_limiter-hd">
      <div className="_text-center _py-4">
        <img src={draw} alt="" className='rude' />
      </div>
      <h4 id='aboutus'>That's how we are:</h4>
      <p className='_limiter-tablet _size-125 _pt-1 _pb-5'>Specialists in creating content. Researchers from the furthest reaches of Google. Lovers of people who listen to good music. Fast to where the quality does not deteriorate. Effective in carrying out a plan, your plan. And beyond all that, A TEAM</p>

      <div className="team">
        <p><span className='colla'>Lead developer & project manager:</span></p>
        <div className="_column leader">
          <div className="_ratio _1-1"><img src={antonio} alt="team member" /></div>
          <div className="wrapper">
            <p>Antonio Muelle</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/antonio-muelle-65a9411a7/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
        </div>
        <p className='_text-left colla'>Talented collaborators:</p>
        <div className="_columns _have-4">
          <div className="_column">
            <div className="_ratio _1-1"><img src={bianchi} alt="team member" /></div>
            <p>Bianchi Juan Jose</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/juan-jose-bianchi-928b8416a/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
          <div className="_column">
            <div className="_ratio _1-1"><img src={carlos} alt="team member" /></div>
            <p>Carlos Da Graça</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/patrick-carlos-da-gra%C3%A7a-284049239/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
          <div className="_column">
            <div className="_ratio _1-1"><img src={abi} alt="team member" /></div>
            <p>Abigail Cortes</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/abigail-cortés-sánchez-8252381a3/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
          <div className="_column">
            <div className="_ratio _1-1"><img src={erick} alt="team member" /></div>
            <p>Erick Espinoza</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/ericks-espinoza-g%C3%B3mez-58b9b8231/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
          <div className="_column">
            <div className="_ratio _1-1"><img src={felipe} alt="team member" /></div>
            <p>Felipe Chiquito</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/juan-felipe-calvo-chiquito-75a993149/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
          <div className="_column">
            <div className="_ratio _1-1"><img src={agus} alt="team member" /></div>
            <p>Agustin Guerrero</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/agust%C3%ADn-guerrero-66700721b/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
          <div className="_column">
            <div className="_ratio _1-1"><img src={rodolfo} alt="team member" /></div>
            <p>Rodolfo Alvarez</p>
            <p>Full Stack Developer <a href='https://www.linkedin.com/in/rodolfo-alvarez-montes/' target="_blank"><i className="fab fa-linkedin"></i></a></p>
          </div>
        </div>
      </div>

      <footer className='_py-4'>
        <h4>Henry Music</h4>
        <p><img src={countries} alt="coders countries" style={{borderRadius: '50%', height: '80px'}} /></p>
        <img src={fb} alt="" />
        <img src={yt} alt="" />
        <img src={github} alt="" />
        <p>&copy; {(new Date()).getFullYear()} Henrymusic</p>
      </footer>
    </div>
  </div>
  )
}