import { useState, useEffect, useRef } from 'react'

interface MenuBarProps {
  currentTime: Date
  onOpenWindow: (type: string, title: string) => void
}

const LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/viraj-murab/' },
  { label: 'Email', url: 'mailto:virajmurabrc@gmail.com' },
  { label: 'GitHub', url: 'https://github.com/VirajCommits' },
  { label: 'Leetcode', url: 'https://leetcode.com/u/VariableViking/' },
  { label: 'X', url: 'https://x.com/virajmurab' }
]

const APPLE_MENU = [
  { label: 'About Me', type: 'about' },
  { label: 'Experience', type: 'experience' },
  { label: 'Resume', type: 'resume' },
  { label: 'Terminal', type: 'terminal' },
  { label: 'Fun Bits', type: 'fun' },
];

const MenuBar = ({ currentTime, onOpenWindow }: MenuBarProps) => {
  const [time, setTime] = useState(currentTime)
  const [linksOpen, setLinksOpen] = useState(false)
  const [appleOpen, setAppleOpen] = useState(false)
  const [clickedApple, setClickedApple] = useState<string | null>(null)
  const [clickedLink, setClickedLink] = useState<string | null>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const appleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (linksRef.current && !linksRef.current.contains(e.target as Node)) {
        setLinksOpen(false)
      }
      if (appleRef.current && !appleRef.current.contains(e.target as Node)) {
        setAppleOpen(false)
      }
    }
    if (linksOpen || appleOpen) {
      window.addEventListener('mousedown', handleClick)
    } else {
      window.removeEventListener('mousedown', handleClick)
    }
    return () => window.removeEventListener('mousedown', handleClick)
  }, [linksOpen, appleOpen])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="menu-bar">
      <div className="menu-left">
        <div ref={appleRef} style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src="/apple_logo.png"
            alt="Apple"
            className="apple-logo"
            style={{ width: 18, height: 18, marginRight: 4, verticalAlign: 'middle', cursor: 'pointer' }}
            onClick={() => setAppleOpen((open) => !open)}
          />
          {appleOpen && (
            <div className="apple-dropdown" style={{
              position: 'absolute',
              top: 22,
              left: 0,
              background: '#fff',
              border: '2px solid #111',
              boxShadow: '2px 2px 0 #111',
              zIndex: 100,
              minWidth: 120,
              fontFamily: 'inherit',
            }}>
              {APPLE_MENU.map(item => (
                <div
                  key={item.type}
                  className={`dropdown-link${clickedApple === item.type ? ' clicked' : ''}`}
                  style={{
                    padding: '6px 18px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    fontSize: 15,
                  }}
                  onClick={() => {
                    setClickedApple(item.type);
                    setTimeout(() => setClickedApple(null), 300);
                    setTimeout(() => {
                      onOpenWindow(item.type, item.label);
                      setAppleOpen(false);
                    }, 150);
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div ref={linksRef} style={{ position: 'relative' }}>
          <span
            className="menu-item"
            style={{ fontWeight: linksOpen ? 'bold' : 'normal', background: linksOpen ? '#111' : undefined, color: linksOpen ? '#fff' : undefined }}
            onClick={() => setLinksOpen((open) => !open)}
          >
            Links
          </span>
          {linksOpen && (
            <div className="links-dropdown">
              {LINKS.map(link => (
                <div
                  key={link.label}
                  className={`dropdown-link${clickedLink === link.label ? ' clicked' : ''}`}
                  onClick={() => {
                    setClickedLink(link.label);
                    setTimeout(() => setClickedLink(null), 300);
                    setTimeout(() => {
                      window.open(link.url, '_blank');
                      setLinksOpen(false);
                    }, 150);
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  {link.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
      </div>
      <div className="menu-right">
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  )
}

export default MenuBar