import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Dock } from './components/Dock'
import { DotMatrix } from './components/DotMatrix'
import { Footer } from './components/Footer'
import { MusicDisc } from './components/MusicDisc'
import { Toaster } from './components/ui/sonner'
import { PortfolioProvider } from './hooks/usePortfolio'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <div className="relative flex min-h-screen flex-col text-foreground">
          <DotMatrix />
          <Dock />
          <MusicDisc />
          <div className="relative z-10 flex flex-1 flex-col pb-24">
            <main className="flex-1 px-4 sm:px-6 lg:px-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </div>
      </PortfolioProvider>
    </BrowserRouter>
  )
}

export default App