import AuthSessionProvider from "./components/session-provider"
import Welcome from "./components/welcome"

export default function Home() {
  return (
    <AuthSessionProvider>
      <Welcome></Welcome>
    </AuthSessionProvider>
  )
}
