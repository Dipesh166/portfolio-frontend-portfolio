import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getPortfolio } from '../lib/api'
import type { Portfolio } from '../lib/types'

type PortfolioState = {
  data: Portfolio | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const PortfolioContext = createContext<PortfolioState | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const portfolio = await getPortfolio()
      setData(portfolio)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const portfolio = await getPortfolio()
        if (!active) return
        setData(portfolio)
        setError(null)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Failed to load portfolio')
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchData()
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({ data, loading, error, refresh: load }),
    [data, loading, error, load],
  )

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortfolio(): PortfolioState {
  const ctx = useContext(PortfolioContext)
  if (!ctx) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return ctx
}