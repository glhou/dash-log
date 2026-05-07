import { Link, useLocation } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

const links = [
  { to: '/ui/', label: 'Home' },
  { to: '/ui/logs', label: 'Logs' },
  { to: '/ui/dashboard', label: 'Dashboard' }
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="flex items-center gap-4 px-6 h-14 border-b">
      <span className="font-semibold text-sm flex items-center gap-2">
        Log manager
        <Badge variant="outline">v0.1</Badge>
      </span>

      <Separator orientation="vertical" className="h-4" />

      <div className="flex gap-1">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${pathname === to
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
