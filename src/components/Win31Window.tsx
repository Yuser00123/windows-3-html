import { useRef, useCallback, type ReactNode } from 'react';

interface WindowProps {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isActive: boolean;
  minimized: boolean;
  maximized: boolean;
  showMenuBar?: boolean;
  menuItems?: { label: string; items?: { label: string; action?: () => void; separator?: boolean }[] }[];
  children: ReactNode;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onClose?: (id: string) => void;
  onResize?: (id: string, w: number, h: number) => void;
  statusBar?: ReactNode;
  activeMenu: string | null;
  onMenuToggle: (menu: string | null) => void;
}

export function Win31Window({
  id, title, x, y, width, height, zIndex, isActive, minimized, maximized,
  showMenuBar, menuItems, children, onFocus, onMove, onMinimize, onMaximize,
  onClose, statusBar, activeMenu, onMenuToggle,
}: WindowProps) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const handleTitleMouseDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return;
    e.preventDefault();
    onFocus(id);
    const origX = x;
    const origY = y;
    const startX = e.clientX;
    const startY = e.clientY;
    dragRef.current = { startX, startY, origX, origY };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onMove(id, dragRef.current.origX + dx, dragRef.current.origY + dy);
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, x, y, maximized, onFocus, onMove]);

  if (minimized) return null;

  const windowStyle: React.CSSProperties = maximized
    ? { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex }
    : { position: 'absolute', left: x, top: y, width, height, zIndex };

  return (
    <div
      style={windowStyle}
      className="flex flex-col"
      onMouseDown={() => onFocus(id)}
    >
      {/* Outer border - raised */}
      <div
        className="flex flex-col h-full win-raised"
        style={{ background: '#c0c0c0', padding: '2px' }}
      >
        {/* Title bar */}
        <div
          className={`title-bar ${isActive ? '' : 'inactive'}`}
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={() => onMaximize?.(id)}
        >
          <div className="flex items-center gap-1 overflow-hidden">
            {/* System menu button */}
            <div
              className="flex items-center justify-center"
              style={{ width: 16, height: 16, marginRight: 2 }}
              onDoubleClick={(e) => { e.stopPropagation(); onClose?.(id); }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <rect x="1" y="1" width="12" height="12" fill={isActive ? '#000080' : '#808080'} stroke="#fff" strokeWidth="0.5"/>
                <line x1="3" y1="4" x2="11" y2="4" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="truncate" style={{ fontSize: 12 }}>{title}</span>
          </div>
          <div className="flex gap-1">
            {onMinimize && (
              <button
                className="win-button win-button-sm"
                onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <polygon points="1,8 5,3 9,8" fill="#000" />
                </svg>
              </button>
            )}
            {onMaximize && (
              <button
                className="win-button win-button-sm"
                onClick={(e) => { e.stopPropagation(); onMaximize(id); }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <svg width="10" height="10" viewBox="0 0 10 10">
                  {maximized ? (
                    <>
                      <polygon points="1,8 5,3 9,8" fill="#000" />
                      <polygon points="1,4 5,9 9,4" fill="#000" />
                    </>
                  ) : (
                    <polygon points="1,4 5,9 9,4" fill="#000" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Menu bar */}
        {showMenuBar && menuItems && (
          <div className="menu-bar">
            {menuItems.map((menu) => (
              <div
                key={menu.label}
                className="menu-item"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onMenuToggle(activeMenu === menu.label ? null : menu.label);
                }}
                onMouseEnter={() => {
                  if (activeMenu !== null) onMenuToggle(menu.label);
                }}
              >
                <span style={{ textDecoration: 'none' }}>
                  <u>{menu.label[0]}</u>{menu.label.slice(1)}
                </span>
                {activeMenu === menu.label && menu.items && (
                  <div className="menu-dropdown" onMouseDown={(e) => e.stopPropagation()}>
                    {menu.items.map((item, idx) =>
                      item.separator ? (
                        <div key={idx} className="menu-separator" />
                      ) : (
                        <div
                          key={idx}
                          className="menu-dropdown-item"
                          onClick={() => {
                            item.action?.();
                            onMenuToggle(null);
                          }}
                        >
                          {item.label}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden" style={{ background: '#c0c0c0' }}>
          {children}
        </div>

        {/* Status bar */}
        {statusBar && (
          <div className="status-bar">
            {statusBar}
          </div>
        )}
      </div>
    </div>
  );
}
