export interface WindowState {
  id: number
  type: 'about' | 'experience' | 'resume' | 'terminal' | 'fun' | string
  title: string
  isOpen: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex?: number
}

export interface DesktopIconProps {
  name: string
  icon: string
  onDoubleClick: () => void
  position?: { x: number; y: number }
  onPositionChange?: (pos: { x: number; y: number }) => void
}