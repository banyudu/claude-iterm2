import { Hero } from './components/Hero'
import { StatusDemo } from './components/StatusDemo'
import { HookPipeline } from './components/HookPipeline'
import { Features } from './components/Features'
import { Config } from './components/Config'
import { Footer } from './components/Footer'

export function App() {
  return (
    <>
      <Hero />
      <StatusDemo />
      <HookPipeline />
      <Features />
      <Config />
      <Footer />
    </>
  )
}
