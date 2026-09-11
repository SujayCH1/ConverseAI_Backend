import { Link, type LinkProps } from 'react-router-dom'

type Props = Omit<LinkProps, 'to'> & { href: string }

export default function RouterLink({ href, ...props }: Props) {
  return <Link to={href} {...props} />
}
