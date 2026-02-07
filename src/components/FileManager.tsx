import { useState } from 'react';
import { FolderIcon, FileIcon, DriveIcon } from './Win31Icons';

interface FileEntry {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  date?: string;
  children?: FileEntry[];
}

const fileSystem: FileEntry = {
  name: 'C:\\',
  type: 'folder',
  children: [
    {
      name: 'WINDOWS',
      type: 'folder',
      children: [
        { name: 'SYSTEM', type: 'folder', children: [
          { name: 'GDI.EXE', type: 'file', size: '163,584', date: '03-10-92' },
          { name: 'KRNL386.EXE', type: 'file', size: '75,490', date: '03-10-92' },
          { name: 'USER.EXE', type: 'file', size: '264,016', date: '03-10-92' },
          { name: 'COMM.DRV', type: 'file', size: '9,280', date: '03-10-92' },
          { name: 'VGA.DRV', type: 'file', size: '73,200', date: '03-10-92' },
          { name: 'MMSYSTEM.DLL', type: 'file', size: '61,648', date: '03-10-92' },
        ]},
        { name: 'FONTS', type: 'folder', children: [
          { name: 'ARIAL.TTF', type: 'file', size: '64,516', date: '03-10-92' },
          { name: 'COUR.TTF', type: 'file', size: '72,356', date: '03-10-92' },
          { name: 'TIMES.TTF', type: 'file', size: '83,220', date: '03-10-92' },
          { name: 'SYMBOL.TTF', type: 'file', size: '56,452', date: '03-10-92' },
        ]},
        { name: 'TEMP', type: 'folder', children: [] },
        { name: 'WIN.INI', type: 'file', size: '3,584', date: '03-10-92' },
        { name: 'SYSTEM.INI', type: 'file', size: '2,048', date: '03-10-92' },
        { name: 'PROGMAN.INI', type: 'file', size: '1,024', date: '03-10-92' },
        { name: 'CONTROL.INI', type: 'file', size: '512', date: '03-10-92' },
        { name: 'WINFILE.EXE', type: 'file', size: '146,864', date: '03-10-92' },
        { name: 'NOTEPAD.EXE', type: 'file', size: '32,032', date: '03-10-92' },
        { name: 'CALC.EXE', type: 'file', size: '43,072', date: '03-10-92' },
        { name: 'WRITE.EXE', type: 'file', size: '244,976', date: '03-10-92' },
        { name: 'PBRUSH.EXE', type: 'file', size: '183,376', date: '03-10-92' },
      ],
    },
    {
      name: 'DOS',
      type: 'folder',
      children: [
        { name: 'COMMAND.COM', type: 'file', size: '54,619', date: '03-10-92' },
        { name: 'EDIT.COM', type: 'file', size: '413', date: '03-10-92' },
        { name: 'FORMAT.COM', type: 'file', size: '22,717', date: '03-10-92' },
        { name: 'XCOPY.EXE', type: 'file', size: '15,820', date: '03-10-92' },
        { name: 'MEM.EXE', type: 'file', size: '39,818', date: '03-10-92' },
        { name: 'CHKDSK.EXE', type: 'file', size: '16,200', date: '03-10-92' },
      ],
    },
    {
      name: 'GAMES',
      type: 'folder',
      children: [
        { name: 'SOL.EXE', type: 'file', size: '180,688', date: '03-10-92' },
        { name: 'WINMINE.EXE', type: 'file', size: '27,776', date: '03-10-92' },
      ],
    },
    { name: 'AUTOEXEC.BAT', type: 'file', size: '256', date: '03-10-92' },
    { name: 'CONFIG.SYS', type: 'file', size: '128', date: '03-10-92' },
    { name: 'IO.SYS', type: 'file', size: '40,566', date: '03-10-92' },
    { name: 'MSDOS.SYS', type: 'file', size: '37,394', date: '03-10-92' },
  ],
};

function TreeNode({ entry, depth, selectedPath, onSelect }: {
  entry: FileEntry;
  depth: number;
  selectedPath: string;
  onSelect: (path: string, entry: FileEntry) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const path = entry.name;

  if (entry.type !== 'folder') return null;

  return (
    <div>
      <div
        className={`file-tree-item ${selectedPath === path ? 'selected' : ''}`}
        style={{ paddingLeft: 4 + depth * 16 }}
        onClick={() => {
          setExpanded(!expanded);
          onSelect(path, entry);
        }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: 10, width: 10, textAlign: 'center' }}>
          {entry.children && entry.children.some(c => c.type === 'folder')
            ? (expanded ? '−' : '+')
            : ' '}
        </span>
        <FolderIcon color={expanded ? '#c0c000' : '#808000'} />
        <span>{entry.name}</span>
      </div>
      {expanded && entry.children?.map((child) => (
        <TreeNode
          key={child.name}
          entry={child}
          depth={depth + 1}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function FileManagerContent() {
  const [selectedFolder, setSelectedFolder] = useState('C:\\');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentFiles, setCurrentFiles] = useState<FileEntry[]>(fileSystem.children || []);

  const handleFolderSelect = (_path: string, entry: FileEntry) => {
    setSelectedFolder(entry.name);
    setCurrentFiles(entry.children || []);
    setSelectedFile(null);
  };

  const totalFiles = currentFiles.filter(f => f.type === 'file').length;
  const totalFolders = currentFiles.filter(f => f.type === 'folder').length;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="drive-bar">
        <button className="win-button" style={{ padding: '0 4px', fontSize: 10 }}>
          <DriveIcon /> <span style={{ marginLeft: 2 }}>A:</span>
        </button>
        <button className="win-button" style={{ padding: '0 4px', fontSize: 10, background: '#dfdfdf' }}>
          <DriveIcon /> <span style={{ marginLeft: 2 }}>C:</span>
        </button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tree panel */}
        <div
          className="win-sunken-deep overflow-auto scrollbar-win"
          style={{ width: '40%', margin: 2, background: '#fff' }}
        >
          <TreeNode
            entry={fileSystem}
            depth={0}
            selectedPath={selectedFolder}
            onSelect={handleFolderSelect}
          />
        </div>

        {/* File list panel */}
        <div
          className="win-sunken-deep overflow-auto scrollbar-win flex-1"
          style={{ margin: 2, background: '#fff' }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              padding: '1px 4px',
              borderBottom: '1px solid #808080',
              background: '#c0c0c0',
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            <span>Name</span>
            <span>Size</span>
            <span>Date</span>
          </div>
          {currentFiles.map((file) => (
            <div
              key={file.name}
              className={`${selectedFile === file.name ? 'bg-[#000080] text-white' : ''}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                padding: '1px 4px',
                cursor: 'default',
                fontSize: 10,
              }}
              onClick={() => setSelectedFile(file.name)}
            >
              <span className="flex items-center gap-1">
                {file.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                {file.name}
              </span>
              <span>{file.size || ''}</span>
              <span>{file.date || ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar" style={{ borderTop: '2px solid #808080' }}>
        <span className="status-section" style={{ flex: 1 }}>
          {selectedFolder} - {totalFolders} folder(s), {totalFiles} file(s)
        </span>
        <span className="status-section">
          Total disk space: 504 MB
        </span>
      </div>
    </div>
  );
}
