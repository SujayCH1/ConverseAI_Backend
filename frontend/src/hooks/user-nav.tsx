import { useLocation } from 'react-router-dom'

export const usePaths = () => {
  const { pathname } = useLocation()
  const path = pathname.split('/')
  let page = path[path.length - 1]
  return { page, pathname }
}
