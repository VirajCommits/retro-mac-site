import { useState } from 'react'
import './Desktop.css'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import MenuBar from './MenuBar'
import type { WindowState } from '../types'

interface IconData {
  name: string
  icon: string
  type: string | null
  position: { x: number; y: number }
}

interface DesktopProps {
  windows: WindowState[]
  onOpenWindow: (type: string, title: string) => void
  onCloseWindow: (id: number) => void
  onUpdateWindow: (id: number, updates: Partial<WindowState>) => void
  onBringToFront: (id: number) => void
}

const initialIcons: IconData[] = [
  { name: 'About Me', icon: '/mac.png', type: 'about', position: { x: 32, y: 64 } },
  { name: 'Experience', icon: '/coffee.png', type: 'experience', position: { x: 162, y: 64 } },
  { name: 'Resume', icon: '/resume.png', type: 'resume', position: { x: 292, y: 64 } },
  { name: 'Terminal', icon: '/terminal.png', type: 'terminal', position: { x: 422, y: 64 } },
  { name: 'Fun Bits', icon: '/funbits.png', type: 'fun', position: { x: 552, y: 64 } },
]

// Add a helper to chunk icons for mobile
function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const HEADER_HEIGHT_MOBILE = 48; // px, adjust if your header is taller

const openWindow = (type: string, title: string) => {
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

const isMobile = window.innerWidth <= 600;

const Desktop = ({ windows, onOpenWindow, onCloseWindow, onUpdateWindow, onBringToFront }: DesktopProps) => {
  const [currentTime] = useState(new Date())
  const [icons, setIcons] = useState<IconData[]>(initialIcons)

  const handleIconPositionChange = (index: number, newPosition: { x: number; y: number }) => {
    setIcons(prev => prev.map((icon, i) => i === index ? { ...icon, position: newPosition } : icon))
  }

  return (
    <div className="desktop">
      <MenuBar currentTime={currentTime} onOpenWindow={onOpenWindow} />
      {isMobile ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
          {chunkArray(icons, 4).map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
              {row.map((icon, i) => (
                <DesktopIcon
                  key={icon.name}
                  name={icon.name}
                  icon={icon.icon}
                  position={icon.position}
                  onDoubleClick={() => icon.type && onOpenWindow(icon.type, icon.name)}
                  onPositionChange={pos => handleIconPositionChange(i + rowIdx * 4, pos)}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        icons.map((icon, i) => (
          <DesktopIcon
            key={icon.name}
            name={icon.name}
            icon={icon.icon}
            position={icon.position}
            onDoubleClick={() => icon.type && onOpenWindow(icon.type, icon.name)}
            onPositionChange={pos => handleIconPositionChange(i, pos)}
          />
        ))
      )}
      {windows.map((window) => (
        <Window
          key={window.id}
          window={window}
          onClose={() => onCloseWindow(window.id)}
          onUpdate={(updates) => onUpdateWindow(window.id, updates)}
          onBringToFront={() => onBringToFront(window.id)}
        />
      ))}
    </div>
  )
}

export default Desktop