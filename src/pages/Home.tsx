import { ErrorScreen, PageLoading } from '../components/States'
import { usePortfolio } from '../hooks/usePortfolio'
import { About } from '../sections/About'
import { Achievements } from '../sections/Achievements'
import { Certifications } from '../sections/Certifications'
import { Contact } from '../sections/Contact'
import { Education } from '../sections/Education'
import { Experience } from '../sections/Experience'
import { Hero } from '../sections/Hero'
import { Projects } from '../sections/Projects'
import { Skills } from '../sections/Skills'

export function Home() {
  const { data, loading, error, refresh } = usePortfolio()

  if (loading && !data) {
    return <PageLoading />
  }

  if (error || !data) {
    return <ErrorScreen message={error ?? 'No data available'} onRetry={refresh} />
  }

  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Certifications />
      <Achievements />
      <Contact />
    </main>
  )
}