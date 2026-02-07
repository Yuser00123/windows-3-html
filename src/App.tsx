import { useState, useCallback, useEffect, useRef } from 'react';
import { Win31Window } from './components/Win31Window';
import { FileManagerContent } from './components/FileManager';
import { iconMap, GroupIcon, WindowsLogoIcon } from './components/Win31Icons';
import {
  CalculatorApp, MinesweeperApp, SolitaireApp, ClockApp, CalendarApp,
  PaintbrushApp, WriteApp, MsDosApp, TerminalApp, ControlPanelApp,
  PrintManagerApp, ClipboardViewerApp, MediaPlayerApp, RecorderApp,
  WindowsSetupApp, ReadmeApp, NotepadApp,
} from './components/Apps';

// ==================== TYPES ====================
type WindowType =
  | 'program-manager' | 'group'
  | 'file-manager' | 'notepad' | 'calculator' | 'minesweeper'
  | 'solitaire' | 'clock' | 'calendar' | 'paintbrush' | 'write'
  | 'msdos' | 'terminal' | 'control-panel' | 'print-manager'
  | 'clipboard-viewer' | 'media-player' | 'recorder'
  | 'windows-setup' | 'readme' | 'about';

interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  type: WindowType;
}

interface GroupDef {
  name: string;
  apps: string[];
}

// ==================== APP CONFIG ====================
interface AppConfig {
  type: WindowType;
  title: string;
  width: number;
  height: number;
}

const appConfigs: Record<string, AppConfig> = {
  'File Manager': { type: 'file-manager', title: 'File Manager', width: 640, height: 400 },
  'Control Panel': { type: 'control-panel', title: 'Control Panel', width: 480, height: 360 },
  'Print Manager': { type: 'print-manager', title: 'Print Manager', width: 500, height: 320 },
  'Clipboard Viewer': { type: 'clipboard-viewer', title: 'Clipboard Viewer', width: 460, height: 300 },
  'MS-DOS Prompt': { type: 'msdos', title: 'MS-DOS Prompt', width: 560, height: 380 },
  'Windows Setup': { type: 'windows-setup', title: 'Windows Setup', width: 440, height: 420 },
  'Read Me': { type: 'readme', title: 'README.WRI - Write', width: 520, height: 440 },
  'Notepad': { type: 'notepad', title: 'Notepad - [Untitled]', width: 500, height: 350 },
  'Write': { type: 'write', title: 'Write - [Untitled]', width: 560, height: 420 },
  'Paintbrush': { type: 'paintbrush', title: 'Paintbrush - [Untitled]', width: 620, height: 460 },
  'Calculator': { type: 'calculator', title: 'Calculator', width: 220, height: 280 },
  'Calendar': { type: 'calendar', title: 'Calendar', width: 260, height: 300 },
  'Clock': { type: 'clock', title: 'Clock', width: 240, height: 290 },
  'Terminal': { type: 'terminal', title: 'Terminal', width: 560, height: 380 },
  'Recorder': { type: 'recorder', title: 'Recorder', width: 400, height: 320 },
  'Media Player': { type: 'media-player', title: 'Media Player', width: 380, height: 280 },
  'Solitaire': { type: 'solitaire', title: 'Solitaire', width: 580, height: 480 },
  'Minesweeper': { type: 'minesweeper', title: 'Minesweeper', width: 240, height: 340 },
};

// ==================== CONSTANTS ====================
const groups: GroupDef[] = [
  { name: 'Main', apps: ['File Manager', 'Control Panel', 'Print Manager', 'Clipboard Viewer', 'MS-DOS Prompt', 'Windows Setup', 'Read Me'] },
  { name: 'Accessories', apps: ['Write', 'Paintbrush', 'Terminal', 'Notepad', 'Recorder', 'Calculator', 'Calendar', 'Clock', 'Media Player'] },
  { name: 'Games', apps: ['Solitaire', 'Minesweeper'] },
];

// ==================== ABOUT DIALOG ====================
function AboutDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 99999, background: 'rgba(0,0,0,0.1)' }} onClick={onClose}>
      <div className="win-raised flex flex-col" style={{ background: '#c0c0c0', padding: 3, width: 420, cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
        <div className="title-bar"><span>About Windows</span></div>
        <div className="flex p-4 gap-4">
          <div className="flex-shrink-0"><WindowsLogoIcon /></div>
          <div className="flex flex-col gap-2" style={{ fontSize: 11 }}>
            <div style={{ fontWeight: 'bold', fontSize: 13 }}>Microsoft Windows</div>
            <div>Version 3.1</div>
            <div>Copyright © 1985-1992 Microsoft Corp.</div>
            <div style={{ marginTop: 4 }}>
              <div className="win-sunken-deep" style={{ padding: '4px 8px', background: '#fff' }}>
                <div>386 Enhanced Mode</div>
                <div>Memory: 16,384 KB Free</div>
                <div>System Resources: 72% Free</div>
              </div>
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: '#808080' }}>This product is licensed to:</div>
            <div style={{ fontSize: 11 }}>Windows User</div>
          </div>
        </div>
        <div className="flex justify-center p-2 pt-0">
          <button className="win-button" style={{ padding: '3px 24px', fontSize: 11 }} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

// ==================== MINIMIZED WINDOW ICON ====================
function MinimizedIcon({ title, icon, onClick }: { title: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <div className="win-raised flex items-center gap-1 cursor-default" style={{ padding: '2px 8px', background: '#c0c0c0', height: 24, minWidth: 120, maxWidth: 180, fontSize: 11 }} onDoubleClick={onClick}>
      <span className="flex-shrink-0" style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <span className="truncate">{title}</span>
    </div>
  );
}

// ==================== APP ICON IN GROUP ====================
function AppIcon({ name, selected, onSelect, onDoubleClick }: { name: string; selected: boolean; onSelect: () => void; onDoubleClick: () => void }) {
  const IconComponent = iconMap[name];
  return (
    <div className={`desktop-icon ${selected ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); onSelect(); }} onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(); }}>
      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? '#000080' : 'transparent', padding: 2 }}>
        {IconComponent ? <IconComponent /> : <GroupIcon />}
      </div>
      <span className="icon-label">{name}</span>
    </div>
  );
}

// ==================== GROUP WINDOW CONTENT ====================
function GroupWindowContent({ group, onOpenApp }: { group: GroupDef; onOpenApp: (appName: string) => void }) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  return (
    <div className="win-sunken-deep h-full overflow-auto scrollbar-win" style={{ background: '#fff', margin: 2 }} onClick={() => setSelectedIcon(null)}>
      <div className="flex flex-wrap content-start p-2 gap-1">
        {group.apps.map((app) => (
          <AppIcon key={app} name={app} selected={selectedIcon === app} onSelect={() => setSelectedIcon(app)} onDoubleClick={() => onOpenApp(app)} />
        ))}
      </div>
    </div>
  );
}

// ==================== RENDER APP CONTENT ====================
function AppContent({ type }: { type: WindowType }) {
  switch (type) {
    case 'file-manager': return <FileManagerContent />;
    case 'notepad': return <NotepadApp />;
    case 'calculator': return <CalculatorApp />;
    case 'minesweeper': return <MinesweeperApp />;
    case 'solitaire': return <SolitaireApp />;
    case 'clock': return <ClockApp />;
    case 'calendar': return <CalendarApp />;
    case 'paintbrush': return <PaintbrushApp />;
    case 'write': return <WriteApp />;
    case 'msdos': return <MsDosApp />;
    case 'terminal': return <TerminalApp />;
    case 'control-panel': return <ControlPanelApp />;
    case 'print-manager': return <PrintManagerApp />;
    case 'clipboard-viewer': return <ClipboardViewerApp />;
    case 'media-player': return <MediaPlayerApp />;
    case 'recorder': return <RecorderApp />;
    case 'windows-setup': return <WindowsSetupApp />;
    case 'readme': return <ReadmeApp />;
    default: return <NotepadApp />;
  }
}

// ==================== MENU DEFINITIONS ====================
function useMenus(setShowAbout: (v: boolean) => void, cascadeGroupWindows: () => void, tileGroupWindows: () => void) {
  const pmMenuItems = [
    {
      label: 'File',
      items: [
        { label: 'New...', action: () => {} },
        { label: 'Open         Enter', action: () => {} },
        { label: 'Move...         F7', action: () => {} },
        { label: 'Copy...         F8', action: () => {} },
        { label: 'Delete       Del', action: () => {} },
        { label: 'Properties Alt+Enter', action: () => {} },
        { separator: true, label: '' },
        { label: 'Run...', action: () => {} },
        { separator: true, label: '' },
        { label: 'Exit Windows...', action: () => {} },
      ],
    },
    { label: 'Options', items: [{ label: 'Auto Arrange', action: () => {} }, { label: 'Minimize on Use', action: () => {} }, { separator: true, label: '' }, { label: 'Save Settings on Exit', action: () => {} }] },
    { label: 'Window', items: [{ label: 'Cascade    Shift+F5', action: cascadeGroupWindows }, { label: 'Tile           Shift+F4', action: tileGroupWindows }, { label: 'Arrange Icons', action: () => {} }] },
    { label: 'Help', items: [{ label: 'Contents', action: () => {} }, { label: 'Search for Help on...', action: () => {} }, { label: 'How to Use Help', action: () => {} }, { separator: true, label: '' }, { label: 'About Program Manager...', action: () => setShowAbout(true) }] },
  ];

  const fileManagerMenuItems = [
    { label: 'File', items: [{ label: 'Open          Enter', action: () => {} }, { label: 'Move...', action: () => {} }, { label: 'Copy...', action: () => {} }, { label: 'Delete        Del', action: () => {} }, { label: 'Rename...', action: () => {} }, { separator: true, label: '' }, { label: 'Properties...', action: () => {} }, { separator: true, label: '' }, { label: 'Exit', action: () => {} }] },
    { label: 'Disk', items: [{ label: 'Copy Disk...', action: () => {} }, { label: 'Label Disk...', action: () => {} }, { separator: true, label: '' }, { label: 'Format Disk...', action: () => {} }] },
    { label: 'Tree', items: [{ label: 'Expand One Level  +', action: () => {} }, { label: 'Expand Branch     *', action: () => {} }, { label: 'Expand All   Ctrl+*', action: () => {} }, { label: 'Collapse Branch   -', action: () => {} }] },
    { label: 'View', items: [{ label: 'Tree and Directory', action: () => {} }, { label: 'Tree Only', action: () => {} }, { label: 'Directory Only', action: () => {} }, { separator: true, label: '' }, { label: 'Name', action: () => {} }, { label: 'All File Details', action: () => {} }] },
    { label: 'Help', items: [{ label: 'Contents', action: () => {} }, { label: 'About File Manager...', action: () => setShowAbout(true) }] },
  ];

  const genericMenuItems = [
    { label: 'File', items: [{ label: 'New', action: () => {} }, { label: 'Open...', action: () => {} }, { label: 'Save', action: () => {} }, { label: 'Save As...', action: () => {} }, { separator: true, label: '' }, { label: 'Print', action: () => {} }, { separator: true, label: '' }, { label: 'Exit', action: () => {} }] },
    { label: 'Edit', items: [{ label: 'Undo         Ctrl+Z', action: () => {} }, { separator: true, label: '' }, { label: 'Cut            Ctrl+X', action: () => {} }, { label: 'Copy         Ctrl+C', action: () => {} }, { label: 'Paste        Ctrl+V', action: () => {} }, { label: 'Delete       Del', action: () => {} }] },
    { label: 'Help', items: [{ label: 'Contents', action: () => {} }, { label: 'About...', action: () => setShowAbout(true) }] },
  ];

  const getMenuForWindow = (type: WindowType) => {
    switch (type) {
      case 'file-manager': return fileManagerMenuItems;
      default: return genericMenuItems;
    }
  };

  return { pmMenuItems, getMenuForWindow };
}

// ==================== MAIN APP ====================
export function App() {
  const nextZRef = useRef(10);
  const [showAbout, setShowAbout] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeWindowId, setActiveWindowId] = useState<string>('program-manager');

  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'program-manager', title: 'Program Manager', x: 0, y: 0, width: window.innerWidth, height: window.innerHeight, minimized: false, maximized: true, zIndex: 1, type: 'program-manager' },
    { id: 'group-main', title: 'Main', x: 20, y: 30, width: 480, height: 200, minimized: false, maximized: false, zIndex: 3, type: 'group' },
    { id: 'group-accessories', title: 'Accessories', x: 40, y: 240, width: 520, height: 180, minimized: false, maximized: false, zIndex: 2, type: 'group' },
    { id: 'group-games', title: 'Games', x: 560, y: 30, width: 250, height: 160, minimized: false, maximized: false, zIndex: 4, type: 'group' },
  ]);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getNextZ = useCallback(() => { nextZRef.current += 1; return nextZRef.current; }, []);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: getNextZ() } : w));
  }, [getNextZ]);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: getNextZ() } : w));
    setActiveWindowId(id);
  }, [getNextZ]);

  const openApp = useCallback((appName: string) => {
    const existingWindow = windows.find(w => w.title === (appConfigs[appName]?.title || appName));
    if (existingWindow) {
      restoreWindow(existingWindow.id);
      focusWindow(existingWindow.id);
      return;
    }

    const config = appConfigs[appName];
    const id = `app-${Date.now()}`;
    const offsetX = 60 + Math.floor(Math.random() * 80);
    const offsetY = 40 + Math.floor(Math.random() * 60);

    const newWindow: WindowState = {
      id,
      title: config?.title || appName,
      x: offsetX, y: offsetY,
      width: config?.width || 400, height: config?.height || 300,
      minimized: false, maximized: false,
      zIndex: getNextZ(),
      type: config?.type || 'notepad',
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(id);
  }, [windows, getNextZ, focusWindow, restoreWindow]);

  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    if (activeMenu) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [activeMenu]);

  const cascadeGroupWindows = useCallback(() => {
    setWindows(prev => {
      const gw = prev.filter(w => w.type === 'group');
      const ow = prev.filter(w => w.type !== 'group');
      return [...ow, ...gw.map((w, i) => ({ ...w, x: 10 + i * 30, y: 30 + i * 30, width: 450, height: 200, minimized: false, zIndex: getNextZ() }))];
    });
  }, [getNextZ]);

  const tileGroupWindows = useCallback(() => {
    setWindows(prev => {
      const gw = prev.filter(w => w.type === 'group' && !w.minimized);
      const ow = prev.filter(w => w.type !== 'group' || w.minimized);
      if (gw.length === 0) return prev;
      const areaW = window.innerWidth - 8;
      const areaH = window.innerHeight - 50;
      const cols = Math.ceil(Math.sqrt(gw.length));
      const rows = Math.ceil(gw.length / cols);
      const tileW = Math.floor(areaW / cols);
      const tileH = Math.floor(areaH / rows);
      return [...ow, ...gw.map((w, i) => ({ ...w, x: (i % cols) * tileW + 4, y: Math.floor(i / cols) * tileH + 26, width: tileW, height: tileH, minimized: false, zIndex: getNextZ() }))];
    });
  }, [getNextZ]);

  const { pmMenuItems, getMenuForWindow } = useMenus(setShowAbout, cascadeGroupWindows, tileGroupWindows);

  const minimizedWindows = windows.filter(w => w.minimized);
  const groupWindows = windows.filter(w => w.type === 'group');
  const appWindows = windows.filter(w => w.type !== 'program-manager' && w.type !== 'group');

  const formatTime = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const windowIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="1" y="2" width="14" height="12" fill="#c0c0c0" stroke="#000" strokeWidth="0.5"/>
      <rect x="1" y="2" width="14" height="3" fill="#000080"/>
    </svg>
  );

  const groupIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect x="1" y="4" width="14" height="10" fill="#c0c0c0" stroke="#000" strokeWidth="0.5"/>
      <rect x="1" y="3" width="8" height="3" fill="#000080" stroke="#000" strokeWidth="0.5"/>
    </svg>
  );

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ background: '#008080' }} onClick={() => setActiveMenu(null)}>
      {/* Program Manager */}
      <Win31Window
        id="program-manager" title="Program Manager"
        x={0} y={0} width={window.innerWidth} height={window.innerHeight}
        zIndex={1} isActive={activeWindowId === 'program-manager' || groupWindows.some(g => g.id === activeWindowId)}
        minimized={false} maximized={true} showMenuBar menuItems={pmMenuItems}
        onFocus={focusWindow} onMove={moveWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}
        activeMenu={activeWindowId === 'program-manager' || groupWindows.some(g => g.id === activeWindowId) ? activeMenu : null}
        onMenuToggle={setActiveMenu}
      >
        <div className="relative w-full h-full" style={{ background: '#008080' }}>
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-conic-gradient(#008080 0% 25%, #007070 0% 50%)`, backgroundSize: '4px 4px', opacity: 0.15 }} />

          {groupWindows.map((gw) => {
            const group = groups.find(g => g.name === gw.title);
            if (!group) return null;
            return (
              <Win31Window key={gw.id} id={gw.id} title={gw.title} x={gw.x} y={gw.y} width={gw.width} height={gw.height} zIndex={gw.zIndex}
                isActive={activeWindowId === gw.id} minimized={gw.minimized} maximized={gw.maximized}
                onFocus={focusWindow} onMove={moveWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow}
                activeMenu={null} onMenuToggle={() => {}}
              >
                <GroupWindowContent group={group} onOpenApp={openApp} />
              </Win31Window>
            );
          })}

          <div className="absolute bottom-1 left-1 flex gap-2 flex-wrap">
            {minimizedWindows.filter(w => w.type === 'group').map((w) => (
              <MinimizedIcon key={w.id} title={w.title} icon={groupIcon} onClick={() => restoreWindow(w.id)} />
            ))}
          </div>
        </div>
      </Win31Window>

      {/* Application windows */}
      {appWindows.filter(w => !w.minimized).map((aw) => (
        <Win31Window key={aw.id} id={aw.id} title={aw.title} x={aw.x} y={aw.y} width={aw.width} height={aw.height} zIndex={aw.zIndex}
          isActive={activeWindowId === aw.id} minimized={aw.minimized} maximized={aw.maximized} showMenuBar
          menuItems={getMenuForWindow(aw.type)}
          onFocus={focusWindow} onMove={moveWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onClose={closeWindow}
          activeMenu={activeWindowId === aw.id ? activeMenu : null} onMenuToggle={setActiveMenu}
        >
          <AppContent type={aw.type} />
        </Win31Window>
      ))}

      {/* Minimized app windows */}
      <div className="absolute bottom-1 right-2 flex gap-2 flex-wrap-reverse items-end" style={{ zIndex: 99990 }}>
        {minimizedWindows.filter(w => w.type !== 'group' && w.type !== 'program-manager').map((w) => (
          <MinimizedIcon key={w.id} title={w.title} icon={windowIcon} onClick={() => restoreWindow(w.id)} />
        ))}
      </div>

      {/* Clock */}
      <div className="absolute bottom-1" style={{
        right: minimizedWindows.filter(w => w.type !== 'group').length > 0 ? 160 : 4,
        zIndex: 99990, fontSize: 10, color: '#fff', textShadow: '1px 1px 0 #000', fontFamily: 'monospace',
      }}>
        {formatTime(time)}
      </div>

      {showAbout && <AboutDialog onClose={() => setShowAbout(false)} />}
    </div>
  );
}
