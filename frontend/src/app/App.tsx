import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { router } from './router'
import { useThemeStore } from '@/stores/themeStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:              1,
      staleTime:          1000 * 60 * 2, // 2 minutes
      gcTime:             1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  useEffect(() => {
    useThemeStore.getState().apply()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" closeButton />
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
