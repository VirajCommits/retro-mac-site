import { useState, useEffect } from 'react'
import './App.css'
import Desktop from './components/Desktop'
import type { WindowState } from './types'

interface MenuBarProps {
  currentTime: Date
}

const MenuBar = ({ currentTime }: MenuBarProps) => {
  const [time, setTime] = useState(currentTime)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="menu-bar">
      <div className="menu-left">
        <span className="apple-logo" role="img" aria-label="Apple">🍎</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Special</span>
      </div>
      <div className="menu-right">
        {/* Add system icons here if you want */}
        <span className="time">{formatTime(time)}</span>
      </div>
    </div>
  )
}

function App() {
  const [windows, setWindows] = useState<WindowState[]>([])

  const openWindow = (type: string, title: string) => {
    const w = 700;
    const h = 450;
    const x = Math.max(0, Math.round((window.innerWidth - w) / 2));
    // Offset y to avoid desktop icons (e.g., y >= 100)
    const y = Math.max(100, Math.round((window.innerHeight - h) / 2));
    const position = { x, y };
    const size = { width: w, height: h };
    const newWindow: WindowState = {
      id: Date.now(),
      type,
      title,
      isOpen: true,
      isMinimized: false,
      position,
      size,
      zIndex: Math.max(...windows.map(w => w.zIndex || 0), 0) + 1
    };
    setWindows([...windows, newWindow]);
  }

  const closeWindow = (id: number) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const updateWindow = (id: number, updates: Partial<WindowState>) => {
    setWindows(windows.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  const bringToFront = (id: number) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex || 0))
    updateWindow(id, { zIndex: maxZ + 1 })
  }

  return (
    <Desktop 
      windows={windows}
      onOpenWindow={openWindow}
      onCloseWindow={closeWindow}
      onUpdateWindow={updateWindow}
      onBringToFront={bringToFront}
    />
  )
}

export default App
