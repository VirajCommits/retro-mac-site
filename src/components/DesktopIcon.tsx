import type { DesktopIconProps } from '../types'
import { useRef, useState } from 'react'

const DesktopIcon = ({ name, icon, onDoubleClick, position, onPositionChange }: DesktopIconProps) => {
  const [dragging, setDragging] = useState(false)
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onPositionChange || !position) return
    setDragging(true)
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!onPositionChange) return
    onPositionChange({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    })
  }

  const handleMouseUp = () => {
    setDragging(false)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return (
    <div
      className="desktop-icon"
      style={{
        position: 'absolute',
        left: position?.x,
        top: position?.y,
        cursor: dragging ? 'grabbing' : 'pointer',
        textAlign: 'center',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        userSelect: 'none',
        zIndex: dragging ? 1000 : undefined,
        width: 80
      }}
      onDoubleClick={!isTouchDevice ? onDoubleClick : undefined}
      onClick={isTouchDevice ? onDoubleClick : undefined}
      onMouseDown={handleMouseDown}
    >
      <img src={icon} alt={name} style={{ width: 48, height: 48, marginBottom: 4, imageRendering: 'pixelated' }} />
      <div
        style={{
          fontSize: '12px',
          maxWidth: '80px',
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}
      >
        {name}
      </div>
    </div>
  )
}

export default DesktopIcon