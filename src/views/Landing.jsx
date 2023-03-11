import { useAuth0 } from "@auth0/auth0-react"

export default function Landing() {
  const { loginWithRedirect } = useAuth0()

  return (
  <div>
    <h1>Landing Component</h1>
    <button onClick={() => loginWithRedirect()}>Log In</button>
  </div>
  )
}