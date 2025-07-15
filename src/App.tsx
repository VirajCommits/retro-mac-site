import { useState } from 'react'
import './App.css'
import Desktop from './components/Desktop'
import type { WindowState } from './types'

function App() {
  const [windows, setWindows] = useState<WindowState[]>([])

  const openWindow = (type: string, title: string) => {
    const HEADER_HEIGHT_MOBILE = 48; // px, adjust if your header is taller
    const isMobile = window.innerWidth <= 600;
    let w = 700;
    let h = 450;
    let x = Math.max(0, Math.round((window.innerWidth - w) / 2));
    let y = Math.max(100, Math.round((window.innerHeight - h) / 2));
    if (isMobile) {
      w = window.innerWidth;
      h = window.innerHeight - HEADER_HEIGHT_MOBILE;
      x = 0;
      y = HEADER_HEIGHT_MOBILE;
    }
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
