import { useState, useEffect, useRef, useCallback } from 'react';

// ===================== CALCULATOR =====================
export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);
  const [memory, setMemory] = useState(0);

  const handleNum = (n: string) => {
    if (resetNext) {
      setDisplay(n);
      setResetNext(false);
    } else {
      setDisplay(display === '0' ? n : display + n);
    }
  };

  const handleOp = (newOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !resetNext) {
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(newOp);
    setResetNext(true);
  };

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (prev !== null && op) {
      const current = parseFloat(display);
      const result = calculate(prev, current, op);
      setDisplay(String(result));
      setPrev(null);
      setOp(null);
      setResetNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setResetNext(false);
  };

  const handleCE = () => {
    setDisplay('0');
    setResetNext(false);
  };

  const handlePercent = () => {
    const val = parseFloat(display);
    if (prev !== null) {
      setDisplay(String(prev * val / 100));
    } else {
      setDisplay(String(val / 100));
    }
    setResetNext(true);
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    setDisplay(String(Math.sqrt(Math.abs(val))));
    setResetNext(true);
  };

  const handlePlusMinus = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handleDot = () => {
    if (resetNext) {
      setDisplay('0.');
      setResetNext(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const btnStyle = (bg?: string): React.CSSProperties => ({
    fontSize: 11, padding: '2px 4px', minWidth: 28, minHeight: 22,
    background: bg || '#c0c0c0',
  });

  return (
    <div style={{ background: '#c0c0c0', padding: 6, height: '100%' }}>
      <div className="win-sunken-deep" style={{ background: '#8fbc8f', padding: '4px 6px', marginBottom: 6, textAlign: 'right' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#000', minHeight: 20, overflow: 'hidden' }}>
          {display}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
        <button className="win-button" style={btnStyle('#ff8c8c')} onClick={() => { setMemory(0); }}>MC</button>
        <button className="win-button" style={btnStyle()} onClick={handleBackspace}>Back</button>
        <button className="win-button" style={btnStyle()} onClick={handleCE}>CE</button>
        <button className="win-button" style={btnStyle('#ff8c8c')} onClick={handleClear}>C</button>
        <button className="win-button" style={btnStyle()} onClick={handleSqrt}>√</button>

        <button className="win-button" style={btnStyle('#8cb8ff')} onClick={() => { const v = parseFloat(display); setMemory(memory + v); setResetNext(true); }}>M+</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('7')}>7</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('8')}>8</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('9')}>9</button>
        <button className="win-button" style={btnStyle('#ff8c8c')} onClick={() => handleOp('/')}>÷</button>

        <button className="win-button" style={btnStyle('#8cb8ff')} onClick={() => { const v = parseFloat(display); setMemory(memory - v); setResetNext(true); }}>M-</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('4')}>4</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('5')}>5</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('6')}>6</button>
        <button className="win-button" style={btnStyle('#ff8c8c')} onClick={() => handleOp('*')}>×</button>

        <button className="win-button" style={btnStyle('#8cb8ff')} onClick={() => { setDisplay(String(memory)); setResetNext(true); }}>MR</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('1')}>1</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('2')}>2</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('3')}>3</button>
        <button className="win-button" style={btnStyle('#ff8c8c')} onClick={() => handleOp('-')}>−</button>

        <button className="win-button" style={btnStyle()} onClick={handlePercent}>%</button>
        <button className="win-button" style={btnStyle()} onClick={() => handleNum('0')}>0</button>
        <button className="win-button" style={btnStyle()} onClick={handlePlusMinus}>±</button>
        <button className="win-button" style={btnStyle()} onClick={handleDot}>.</button>
        <button className="win-button" style={btnStyle('#ff8c8c')} onClick={() => handleOp('+')}>+</button>
      </div>
      <div style={{ marginTop: 4 }}>
        <button className="win-button" style={{ ...btnStyle('#8cb8ff'), width: '100%' }} onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

// ===================== MINESWEEPER =====================
type MineCell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

export function MinesweeperApp() {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [board, setBoard] = useState<MineCell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [face, setFace] = useState('🙂');
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initBoard = useCallback(() => {
    const b: MineCell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
    );
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!b[r][c].mine) { b[r][c].mine = true; placed++; }
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (b[r][c].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine) count++;
          }
        b[r][c].adjacent = count;
      }
    }
    return b;
  }, []);

  useEffect(() => {
    setBoard(initBoard());
  }, [initBoard]);

  useEffect(() => {
    if (started && !gameOver && !won) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, gameOver, won]);

  const reset = () => {
    setBoard(initBoard());
    setGameOver(false);
    setWon(false);
    setFace('🙂');
    setTime(0);
    setStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const reveal = (r: number, c: number) => {
    if (gameOver || won || board.length === 0) return;
    if (!started) setStarted(true);
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    if (nb[r][c].flagged || nb[r][c].revealed) return;

    if (nb[r][c].mine) {
      // Game over
      for (let i = 0; i < ROWS; i++)
        for (let j = 0; j < COLS; j++)
          if (nb[i][j].mine) nb[i][j].revealed = true;
      setBoard(nb);
      setGameOver(true);
      setFace('😵');
      return;
    }

    const flood = (rr: number, cc: number) => {
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return;
      if (nb[rr][cc].revealed || nb[rr][cc].flagged || nb[rr][cc].mine) return;
      nb[rr][cc].revealed = true;
      if (nb[rr][cc].adjacent === 0) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++)
            flood(rr + dr, cc + dc);
      }
    };
    flood(r, c);
    setBoard(nb);

    // Check win
    let unrevealed = 0;
    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLS; j++)
        if (!nb[i][j].revealed) unrevealed++;
    if (unrevealed === MINES) {
      setWon(true);
      setFace('😎');
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || board.length === 0) return;
    if (board[r][c].revealed) return;
    const nb = board.map(row => row.map(cell => ({ ...cell })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb);
  };

  const flagCount = board.flat().filter(c => c.flagged).length;
  const numColors: Record<number, string> = {
    1: '#0000ff', 2: '#008000', 3: '#ff0000', 4: '#000080',
    5: '#800000', 6: '#008080', 7: '#000', 8: '#808080',
  };

  return (
    <div style={{ background: '#c0c0c0', padding: 6, height: '100%' }}>
      {/* Header */}
      <div className="win-sunken" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 4, marginBottom: 4 }}>
        <div className="win-sunken-deep" style={{ background: '#000', color: '#ff0000', fontFamily: 'monospace', fontSize: 18, padding: '2px 6px', minWidth: 40, textAlign: 'right', fontWeight: 'bold' }}>
          {String(MINES - flagCount).padStart(3, '0')}
        </div>
        <button className="win-button" onClick={reset} style={{ fontSize: 16, padding: '0 4px', lineHeight: 1 }}>
          {face}
        </button>
        <div className="win-sunken-deep" style={{ background: '#000', color: '#ff0000', fontFamily: 'monospace', fontSize: 18, padding: '2px 6px', minWidth: 40, textAlign: 'right', fontWeight: 'bold' }}>
          {String(Math.min(time, 999)).padStart(3, '0')}
        </div>
      </div>
      {/* Board */}
      <div className="win-sunken-deep" style={{ display: 'inline-block', padding: 1 }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => (
              <div
                key={c}
                style={{
                  width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 'bold', cursor: 'default', userSelect: 'none',
                  background: cell.revealed ? '#c0c0c0' : undefined,
                  color: cell.revealed && !cell.mine ? (numColors[cell.adjacent] || '#000') : '#000',
                }}
                className={cell.revealed ? 'win-sunken' : 'win-raised'}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
              >
                {cell.revealed && cell.mine ? '💣' :
                  cell.flagged ? '🚩' :
                  cell.revealed && cell.adjacent > 0 ? cell.adjacent : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      {won && <div style={{ marginTop: 4, textAlign: 'center', fontWeight: 'bold', color: '#008000' }}>You Win! 🎉</div>}
      {gameOver && <div style={{ marginTop: 4, textAlign: 'center', fontWeight: 'bold', color: '#ff0000' }}>Game Over!</div>}
    </div>
  );
}

// ===================== SOLITAIRE =====================
export function SolitaireApp() {
  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const [deck, setDeck] = useState<{ rank: string; suit: string; faceUp: boolean }[]>([]);
  const [drawn, setDrawn] = useState<{ rank: string; suit: string; faceUp: boolean }[]>([]);
  const [tableau, setTableau] = useState<{ rank: string; suit: string; faceUp: boolean }[][]>([]);
  const [foundations, setFoundations] = useState<{ rank: string; suit: string }[][]>([[], [], [], []]);

  const isRed = (suit: string) => suit === '♥' || suit === '♦';

  const initGame = useCallback(() => {
    const cards = suits.flatMap(s => ranks.map(r => ({ rank: r, suit: s, faceUp: false })));
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    const tab: typeof cards[] = [[], [], [], [], [], [], []];
    let idx = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = { ...cards[idx++] };
        if (row === col) card.faceUp = true;
        tab[col].push(card);
      }
    }
    setTableau(tab);
    setDeck(cards.slice(idx).map(c => ({ ...c, faceUp: false })));
    setDrawn([]);
    setFoundations([[], [], [], []]);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const drawCard = () => {
    if (deck.length === 0) {
      setDeck(drawn.reverse().map(c => ({ ...c, faceUp: false })));
      setDrawn([]);
    } else {
      const card = { ...deck[deck.length - 1], faceUp: true };
      setDeck(deck.slice(0, -1));
      setDrawn([...drawn, card]);
    }
  };

  const tryMoveToFoundation = (card: { rank: string; suit: string }) => {
    const rankIdx = ranks.indexOf(card.rank);
    const fIdx = foundations.findIndex(f => {
      if (f.length === 0) return rankIdx === 0;
      return f[f.length - 1].suit === card.suit && ranks.indexOf(f[f.length - 1].rank) === rankIdx - 1;
    });
    if (fIdx !== -1) {
      const nf = foundations.map((f, i) => i === fIdx ? [...f, card] : [...f]);
      setFoundations(nf);
      return true;
    }
    return false;
  };

  const handleDrawnClick = () => {
    if (drawn.length === 0) return;
    const card = drawn[drawn.length - 1];
    if (tryMoveToFoundation(card)) {
      setDrawn(drawn.slice(0, -1));
    } else {
      // Try to move to tableau
      const rankIdx = ranks.indexOf(card.rank);
      for (let col = 0; col < 7; col++) {
        const pile = tableau[col];
        if (pile.length === 0 && card.rank === 'K') {
          const nt = tableau.map((p, i) => i === col ? [...p, { ...card, faceUp: true }] : [...p]);
          setTableau(nt);
          setDrawn(drawn.slice(0, -1));
          return;
        }
        if (pile.length > 0) {
          const top = pile[pile.length - 1];
          if (top.faceUp && isRed(top.suit) !== isRed(card.suit) && ranks.indexOf(top.rank) === rankIdx + 1) {
            const nt = tableau.map((p, i) => i === col ? [...p, { ...card, faceUp: true }] : [...p]);
            setTableau(nt);
            setDrawn(drawn.slice(0, -1));
            return;
          }
        }
      }
    }
  };

  const handleTableauClick = (colIdx: number) => {
    const pile = tableau[colIdx];
    if (pile.length === 0) return;
    const card = pile[pile.length - 1];
    if (!card.faceUp) {
      const nt = tableau.map((p, i) => {
        if (i !== colIdx) return [...p];
        const np = [...p];
        np[np.length - 1] = { ...np[np.length - 1], faceUp: true };
        return np;
      });
      setTableau(nt);
      return;
    }
    if (tryMoveToFoundation(card)) {
      const nt = tableau.map((p, i) => i === colIdx ? p.slice(0, -1) : [...p]);
      setTableau(nt);
    }
  };

  const totalWon = foundations.reduce((s, f) => s + f.length, 0);
  const cardW = 46, cardH = 64;

  const renderCard = (card: { rank: string; suit: string; faceUp: boolean }, style?: React.CSSProperties) => {
    if (!card.faceUp) {
      return (
        <div style={{
          width: cardW, height: cardH, background: '#0000aa',
          border: '1px solid #000', borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...style,
        }}>
          <div style={{ width: cardW - 8, height: cardH - 8, border: '1px solid #fff', borderRadius: 2, background: '#0000cc' }} />
        </div>
      );
    }
    const red = isRed(card.suit);
    return (
      <div style={{
        width: cardW, height: cardH, background: '#fff',
        border: '1px solid #000', borderRadius: 3, padding: 2,
        color: red ? '#cc0000' : '#000', fontSize: 10, cursor: 'pointer',
        ...style,
      }}>
        <div style={{ fontWeight: 'bold' }}>{card.rank}{card.suit}</div>
        <div style={{ position: 'absolute', bottom: 2, right: 4, fontSize: 14 }}>{card.suit}</div>
      </div>
    );
  };

  return (
    <div style={{ background: '#008040', height: '100%', padding: 8, overflow: 'auto' }}>
      {/* Top row: deck, drawn, foundations */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {/* Deck */}
        <div
          style={{ width: cardW, height: cardH, border: '2px solid #006020', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={drawCard}
        >
          {deck.length > 0 ? renderCard({ rank: '', suit: '', faceUp: false }) :
            <span style={{ color: '#fff', fontSize: 20 }}>↻</span>}
        </div>
        {/* Drawn */}
        <div style={{ width: cardW, height: cardH, position: 'relative' }} onClick={handleDrawnClick}>
          {drawn.length > 0 ?
            <div style={{ position: 'relative' }}>{renderCard({ ...drawn[drawn.length - 1], faceUp: true })}</div> :
            <div style={{ width: cardW, height: cardH, border: '1px dashed #006020', borderRadius: 3 }} />
          }
        </div>
        <div style={{ width: 20 }} />
        {/* Foundations */}
        {foundations.map((f, i) => (
          <div key={i} style={{ width: cardW, height: cardH, border: '1px dashed #006020', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {f.length > 0 ? renderCard({ ...f[f.length - 1], faceUp: true }) :
              <span style={{ color: '#006020', fontSize: 16 }}>{suits[i]}</span>}
          </div>
        ))}
      </div>
      {/* Tableau */}
      <div style={{ display: 'flex', gap: 6 }}>
        {tableau.map((pile, colIdx) => (
          <div key={colIdx} style={{ width: cardW, minHeight: cardH, position: 'relative' }}>
            {pile.length === 0 ?
              <div style={{ width: cardW, height: cardH, border: '1px dashed #006020', borderRadius: 3 }} /> :
              pile.map((card, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{ position: 'absolute', top: rowIdx * (card.faceUp ? 18 : 6), left: 0 }}
                  onClick={() => { if (rowIdx === pile.length - 1) handleTableauClick(colIdx); }}
                >
                  {renderCard(card)}
                </div>
              ))
            }
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 4, right: 8, color: '#fff', fontSize: 11 }}>
        Cards won: {totalWon}/52
      </div>
      <button className="win-button" onClick={initGame} style={{ position: 'absolute', bottom: 4, left: 8, fontSize: 10 }}>New Game</button>
    </div>
  );
}

// ===================== CLOCK =====================
export function ClockApp() {
  const [now, setNow] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2, r = Math.min(cx, cy) - 10;

    ctx.clearRect(0, 0, w, h);
    // Face
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const inner = r - 12;
      const outer = r - 5;
      ctx.beginPath();
      ctx.moveTo(cx + inner * Math.cos(angle), cy + inner * Math.sin(angle));
      ctx.lineTo(cx + outer * Math.cos(angle), cy + outer * Math.sin(angle));
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Minute markers
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = (i * 6 - 90) * Math.PI / 180;
      const inner = r - 8;
      const outer = r - 5;
      ctx.beginPath();
      ctx.moveTo(cx + inner * Math.cos(angle), cy + inner * Math.sin(angle));
      ctx.lineTo(cx + outer * Math.cos(angle), cy + outer * Math.sin(angle));
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Hour numbers
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const nr = r - 24;
      ctx.fillText(String(i), cx + nr * Math.cos(angle), cy + nr * Math.sin(angle));
    }

    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Hour hand
    const hAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r * 0.5) * Math.cos(hAngle), cy + (r * 0.5) * Math.sin(hAngle));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Minute hand
    const mAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r * 0.7) * Math.cos(mAngle), cy + (r * 0.7) * Math.sin(mAngle));
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Second hand
    const sAngle = (seconds * 6 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (r * 0.75) * Math.cos(sAngle), cy + (r * 0.75) * Math.sin(sAngle));
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
  }, [now]);

  return (
    <div style={{ background: '#c0c0c0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <canvas ref={canvasRef} width={200} height={200} />
      <div style={{ marginTop: 8, fontSize: 14, fontFamily: 'monospace', fontWeight: 'bold' }}>
        {now.toLocaleTimeString()}
      </div>
      <div style={{ fontSize: 11, color: '#808080' }}>
        {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}

// ===================== CALENDAR =====================
export function CalendarApp() {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={{ background: '#c0c0c0', padding: 8, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <button className="win-button" onClick={prevMonth} style={{ fontSize: 10, padding: '1px 6px' }}>◀</button>
        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{monthNames[month]} {year}</span>
        <button className="win-button" onClick={nextMonth} style={{ fontSize: 10, padding: '1px 6px' }}>▶</button>
      </div>
      <div className="win-sunken-deep" style={{ background: '#fff', padding: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, textAlign: 'center' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} style={{ fontSize: 10, fontWeight: 'bold', padding: 2, borderBottom: '1px solid #808080', color: d === 'Su' || d === 'Sa' ? '#ff0000' : '#000' }}>{d}</div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              style={{
                fontSize: 11, padding: 3, cursor: day ? 'pointer' : 'default',
                background: day && isToday(day) ? '#000080' : 'transparent',
                color: day && isToday(day) ? '#fff' : '#000',
                fontWeight: day && isToday(day) ? 'bold' : 'normal',
                border: day && isToday(day) ? '1px solid #000' : '1px solid transparent',
              }}
            >
              {day || ''}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 6, fontSize: 10, textAlign: 'center', color: '#808080' }}>
        Today: {today.toLocaleDateString()}
      </div>
    </div>
  );
}

// ===================== PAINTBRUSH =====================
export function PaintbrushApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill'>('pen');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent) => {
    setDrawing(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, tool === 'eraser' ? brushSize * 2 : brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#fff' : color;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !lastPosRef.current) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#fff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const stopDraw = () => {
    setDrawing(false);
    lastPosRef.current = null;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const colors = [
    '#000000', '#808080', '#800000', '#ff0000',
    '#008000', '#00ff00', '#808000', '#ffff00',
    '#000080', '#0000ff', '#800080', '#ff00ff',
    '#008080', '#00ffff', '#c0c0c0', '#ffffff',
  ];

  return (
    <div style={{ background: '#c0c0c0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2, borderBottom: '1px solid #808080' }}>
        <button className={`win-button ${tool === 'pen' ? '' : ''}`} onClick={() => setTool('pen')} style={{ fontSize: 10, padding: '1px 4px', background: tool === 'pen' ? '#dfdfdf' : undefined }}>✏️ Pen</button>
        <button className="win-button" onClick={() => setTool('eraser')} style={{ fontSize: 10, padding: '1px 4px', background: tool === 'eraser' ? '#dfdfdf' : undefined }}>🧹 Eraser</button>
        <div style={{ width: 1, height: 16, background: '#808080', margin: '0 2px' }} />
        <span style={{ fontSize: 10 }}>Size:</span>
        {[1, 3, 5, 8].map(s => (
          <button key={s} className="win-button" onClick={() => setBrushSize(s)} style={{ fontSize: 9, padding: '0 3px', minWidth: 18, background: brushSize === s ? '#dfdfdf' : undefined }}>{s}</button>
        ))}
        <div style={{ width: 1, height: 16, background: '#808080', margin: '0 2px' }} />
        <button className="win-button" onClick={clearCanvas} style={{ fontSize: 10, padding: '1px 4px' }}>Clear</button>
      </div>
      {/* Canvas */}
      <div className="flex-1 overflow-hidden" style={{ margin: 2 }}>
        <div className="win-sunken-deep" style={{ height: '100%', overflow: 'hidden' }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ cursor: 'crosshair' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
          />
        </div>
      </div>
      {/* Color palette */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 1, padding: 3, borderTop: '1px solid #808080' }}>
        <div className="win-sunken" style={{ width: 24, height: 24, background: color, marginRight: 4 }} />
        {colors.map(c => (
          <div
            key={c}
            className={c === color ? 'win-sunken' : 'win-raised'}
            style={{ width: 16, height: 16, background: c, cursor: 'pointer' }}
            onClick={() => { setColor(c); setTool('pen'); }}
          />
        ))}
      </div>
    </div>
  );
}

// ===================== WRITE (Word Processor) =====================
export function WriteApp() {
  const [text, setText] = useState(
    'Welcome to Microsoft Write!\n\n' +
    'Write is a simple word processor included with Windows 3.1. ' +
    'You can create and edit documents with basic formatting.\n\n' +
    'This program supports basic text editing functionality. ' +
    'Try typing your own document here!\n\n' +
    'Features:\n' +
    '  • Basic text editing\n' +
    '  • Word wrap\n' +
    '  • Multiple documents\n'
  );
  const [fontSize, setFontSize] = useState(12);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  return (
    <div style={{ background: '#c0c0c0', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 2, borderBottom: '1px solid #808080' }}>
        <select className="win-sunken" style={{ fontSize: 10, padding: 1, height: 20 }} defaultValue="Arial">
          <option>Arial</option>
          <option>Courier New</option>
          <option>Times New Roman</option>
          <option>Helvetica</option>
        </select>
        <select className="win-sunken" style={{ fontSize: 10, padding: 1, width: 40, height: 20 }} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}>
          {[8, 10, 12, 14, 16, 18, 20, 24, 28, 36].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ width: 1, height: 16, background: '#808080', margin: '0 2px' }} />
        <button className="win-button" onClick={() => setBold(!bold)} style={{ fontSize: 11, fontWeight: 'bold', padding: '0 4px', minWidth: 22, background: bold ? '#a0a0a0' : undefined }}>B</button>
        <button className="win-button" onClick={() => setItalic(!italic)} style={{ fontSize: 11, fontStyle: 'italic', padding: '0 4px', minWidth: 22, background: italic ? '#a0a0a0' : undefined }}>I</button>
        <div style={{ width: 1, height: 16, background: '#808080', margin: '0 2px' }} />
        <button className="win-button" style={{ fontSize: 10, padding: '0 3px' }}>≡L</button>
        <button className="win-button" style={{ fontSize: 10, padding: '0 3px' }}>≡C</button>
        <button className="win-button" style={{ fontSize: 10, padding: '0 3px' }}>≡R</button>
      </div>
      {/* Ruler */}
      <div style={{ height: 18, background: '#fff', borderBottom: '1px solid #808080', display: 'flex', alignItems: 'end', paddingLeft: 4 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ width: 30, fontSize: 8, color: '#808080', borderLeft: '1px solid #c0c0c0', paddingLeft: 2 }}>{i + 1}</div>
        ))}
      </div>
      {/* Text area */}
      <div className="flex-1" style={{ margin: 2 }}>
        <textarea
          className="w-full h-full resize-none outline-none"
          style={{
            fontSize, fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal',
            border: '2px inset #808080', padding: 8, background: '#fff', color: '#000',
            fontFamily: 'Arial, sans-serif', lineHeight: 1.4,
          }}
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="status-bar">
        <span className="status-section" style={{ flex: 1 }}>Page 1</span>
        <span className="status-section">Ln {text.substring(0, text.length).split('\n').length}</span>
      </div>
    </div>
  );
}

// ===================== MS-DOS PROMPT =====================
export function MsDosApp() {
  const [lines, setLines] = useState<string[]>([
    'Microsoft(R) MS-DOS(R) Version 6.22',
    '(C)Copyright Microsoft Corp 1981-1994.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('C:\\');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const processCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toUpperCase();
    const newLines = [...lines, `${currentDir}>${cmd}`];

    switch (command) {
      case 'DIR':
        newLines.push(' Volume in drive C has no label');
        newLines.push(' Volume Serial Number is 1A2B-3C4D');
        newLines.push(` Directory of ${currentDir}`);
        newLines.push('');
        newLines.push('.              <DIR>     03-10-92  3:10a');
        newLines.push('..             <DIR>     03-10-92  3:10a');
        newLines.push('WINDOWS        <DIR>     03-10-92  3:10a');
        newLines.push('DOS            <DIR>     03-10-92  3:10a');
        newLines.push('GAMES          <DIR>     03-10-92  3:10a');
        newLines.push('AUTOEXEC BAT       256   03-10-92  3:10a');
        newLines.push('CONFIG   SYS       128   03-10-92  3:10a');
        newLines.push('IO       SYS    40,566   03-10-92  3:10a');
        newLines.push('MSDOS    SYS    37,394   03-10-92  3:10a');
        newLines.push('         4 file(s)     78,344 bytes');
        newLines.push('         3 dir(s)  504,233,984 bytes free');
        break;
      case 'CLS':
        setLines([]);
        setInput('');
        return;
      case 'VER':
        newLines.push('');
        newLines.push('MS-DOS Version 6.22');
        break;
      case 'DATE':
        newLines.push(`Current date is ${new Date().toLocaleDateString()}`);
        break;
      case 'TIME':
        newLines.push(`Current time is ${new Date().toLocaleTimeString()}`);
        break;
      case 'HELP':
        newLines.push('');
        newLines.push('Available commands:');
        newLines.push('  DIR      - List directory contents');
        newLines.push('  CLS      - Clear screen');
        newLines.push('  VER      - Display DOS version');
        newLines.push('  DATE     - Display current date');
        newLines.push('  TIME     - Display current time');
        newLines.push('  CD       - Change directory');
        newLines.push('  TYPE     - Display file contents');
        newLines.push('  MEM      - Display memory usage');
        newLines.push('  ECHO     - Display message');
        newLines.push('  HELP     - Display this help');
        newLines.push('  EXIT     - Exit DOS prompt');
        break;
      case 'MEM':
        newLines.push('');
        newLines.push('Memory Type        Total    Used     Free');
        newLines.push('──────────────  ────────  ──────  ────────');
        newLines.push('Conventional      640K     156K     484K');
        newLines.push('Upper               0K       0K       0K');
        newLines.push('Extended         15360K    2048K   13312K');
        newLines.push('──────────────  ────────  ──────  ────────');
        newLines.push('Total memory     16000K    2204K   13796K');
        break;
      case 'ECHO':
        newLines.push(parts.slice(1).join(' '));
        break;
      case 'CD':
        if (parts[1]) {
          if (parts[1] === '..') {
            setCurrentDir('C:\\');
          } else {
            setCurrentDir(`C:\\${parts[1].toUpperCase()}`);
          }
        } else {
          newLines.push(currentDir);
        }
        break;
      case 'TYPE':
        if (parts[1]?.toUpperCase() === 'AUTOEXEC.BAT') {
          newLines.push('@ECHO OFF');
          newLines.push('PATH C:\\DOS;C:\\WINDOWS');
          newLines.push('SET TEMP=C:\\WINDOWS\\TEMP');
          newLines.push('C:\\WINDOWS\\SMARTDRV.EXE');
          newLines.push('');
        } else if (parts[1]?.toUpperCase() === 'CONFIG.SYS') {
          newLines.push('DEVICE=C:\\DOS\\HIMEM.SYS');
          newLines.push('DEVICE=C:\\DOS\\EMM386.EXE NOEMS');
          newLines.push('DOS=HIGH,UMB');
          newLines.push('FILES=30');
          newLines.push('BUFFERS=20');
          newLines.push('');
        } else {
          newLines.push(`File not found - ${parts[1] || ''}`);
        }
        break;
      case 'EXIT':
        newLines.push('Returning to Windows...');
        break;
      case '':
        break;
      default:
        newLines.push(`Bad command or file name`);
        break;
    }
    newLines.push('');
    setLines(newLines);
    setInput('');
  };

  return (
    <div
      ref={scrollRef}
      style={{
        background: '#000', color: '#c0c0c0', fontFamily: 'Courier New, monospace',
        fontSize: 13, padding: 4, height: '100%', overflow: 'auto', cursor: 'text',
      }}
      onClick={() => {
        const inp = document.getElementById('dos-input');
        if (inp) inp.focus();
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: 'pre', minHeight: 16 }}>{line}</div>
      ))}
      <div style={{ display: 'flex' }}>
        <span>{currentDir}&gt;</span>
        <input
          id="dos-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') processCommand(input); }}
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: '#c0c0c0', fontFamily: 'Courier New, monospace', fontSize: 13,
            flex: 1, padding: 0, caretColor: '#c0c0c0',
          }}
          autoFocus
        />
      </div>
    </div>
  );
}

// ===================== TERMINAL =====================
export function TerminalApp() {
  return <MsDosApp />;
}

// ===================== CONTROL PANEL =====================
export function ControlPanelApp() {
  const items = [
    { name: 'Color', icon: '🎨', desc: 'Change screen colors and appearance' },
    { name: 'Fonts', icon: '🔤', desc: 'Add and remove fonts' },
    { name: 'Ports', icon: '🔌', desc: 'Configure serial port settings' },
    { name: 'Mouse', icon: '🖱️', desc: 'Configure mouse settings' },
    { name: 'Desktop', icon: '🖥️', desc: 'Change desktop pattern and wallpaper' },
    { name: 'Keyboard', icon: '⌨️', desc: 'Set keyboard repeat rate' },
    { name: 'Printers', icon: '🖨️', desc: 'Add and configure printers' },
    { name: 'International', icon: '🌍', desc: 'Change country settings' },
    { name: 'Date/Time', icon: '📅', desc: 'Change date and time settings' },
    { name: 'Network', icon: '🌐', desc: 'Configure network settings' },
    { name: 'Sound', icon: '🔊', desc: 'Configure system sounds' },
    { name: 'Drivers', icon: '💾', desc: 'Add and remove drivers' },
    { name: '386 Enhanced', icon: '⚡', desc: 'Configure 386 enhanced mode' },
    { name: 'MIDI Mapper', icon: '🎵', desc: 'Configure MIDI settings' },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<string | null>(null);

  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="win-sunken-deep" style={{ background: '#fff', margin: 4, flex: 1, overflow: 'auto', position: 'relative' }} onClick={() => setSelected(null)}>
        <div style={{ display: 'flex', flexWrap: 'wrap', padding: 8, gap: 4, alignContent: 'start' }}>
          {items.map(item => (
            <div
              key={item.name}
              className={`desktop-icon ${selected === item.name ? 'selected' : ''}`}
              onClick={e => { e.stopPropagation(); setSelected(item.name); }}
              onDoubleClick={e => { e.stopPropagation(); setShowDialog(item.name); }}
              style={{ width: 72 }}
            >
              <div style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, background: selected === item.name ? '#000080' : 'transparent',
              }}>
                {item.icon}
              </div>
              <span className="icon-label">{item.name}</span>
            </div>
          ))}
        </div>
        {showDialog && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }} onClick={() => setShowDialog(null)}>
            <div className="win-raised" style={{ background: '#c0c0c0', padding: 3, width: 300 }} onClick={e => e.stopPropagation()}>
              <div className="title-bar"><span>{showDialog}</span></div>
              <div style={{ padding: 16, fontSize: 11, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{items.find(i => i.name === showDialog)?.icon}</div>
                <p>{items.find(i => i.name === showDialog)?.desc}</p>
                <p style={{ marginTop: 8, color: '#808080' }}>This setting is not available in the simulation.</p>
                <button className="win-button" style={{ marginTop: 12, padding: '3px 20px' }} onClick={() => setShowDialog(null)}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="status-bar">
        <span className="status-section" style={{ flex: 1 }}>
          {selected ? items.find(i => i.name === selected)?.desc : 'Select a Control Panel item'}
        </span>
      </div>
    </div>
  );
}

// ===================== PRINT MANAGER =====================
export function PrintManagerApp() {
  const [jobs] = useState([
    { id: 1, doc: 'LETTER.WRI', printer: 'HP LaserJet III', status: 'Printing...', size: '24 KB', progress: 65 },
    { id: 2, doc: 'REPORT.WRI', printer: 'HP LaserJet III', status: 'Queued', size: '156 KB', progress: 0 },
    { id: 3, doc: 'README.TXT', printer: 'HP LaserJet III', status: 'Queued', size: '4 KB', progress: 0 },
  ]);

  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 4, padding: 4, borderBottom: '1px solid #808080' }}>
        <button className="win-button" style={{ fontSize: 10, padding: '1px 8px' }}>Pause</button>
        <button className="win-button" style={{ fontSize: 10, padding: '1px 8px' }}>Resume</button>
        <button className="win-button" style={{ fontSize: 10, padding: '1px 8px' }}>Delete</button>
      </div>
      <div className="win-sunken-deep" style={{ background: '#fff', margin: 4, flex: 1, overflow: 'auto' }}>
        {/* Printer */}
        <div style={{ padding: '4px 8px', borderBottom: '1px solid #c0c0c0', display: 'flex', alignItems: 'center', gap: 4, background: '#f0f0f0', fontSize: 11 }}>
          <span>🖨️</span>
          <span style={{ fontWeight: 'bold' }}>HP LaserJet III on LPT1:</span>
          <span style={{ color: '#008000', marginLeft: 'auto' }}>[Active]</span>
        </div>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', padding: '2px 8px', borderBottom: '1px solid #808080', background: '#c0c0c0', fontSize: 10, fontWeight: 'bold' }}>
          <span>Document</span>
          <span>Size</span>
          <span>Status</span>
          <span>Progress</span>
        </div>
        {jobs.map(job => (
          <div key={job.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', padding: '3px 8px', borderBottom: '1px solid #e0e0e0', fontSize: 10, alignItems: 'center' }}>
            <span>📄 {job.doc}</span>
            <span>{job.size}</span>
            <span style={{ color: job.status === 'Printing...' ? '#008000' : '#808080' }}>{job.status}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div className="win-sunken" style={{ flex: 1, height: 12, background: '#fff' }}>
                <div style={{ width: `${job.progress}%`, height: '100%', background: '#000080' }} />
              </div>
              <span>{job.progress}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="status-bar">
        <span className="status-section" style={{ flex: 1 }}>
          3 print jobs - 1 printing, 2 queued
        </span>
      </div>
    </div>
  );
}

// ===================== CLIPBOARD VIEWER =====================
export function ClipboardViewerApp() {
  const [clipText, setClipText] = useState('(The clipboard is currently empty)\n\nCopy text from any application to view it here.');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setClipText(text);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 4, padding: 4, borderBottom: '1px solid #808080' }}>
        <button className="win-button" style={{ fontSize: 10, padding: '1px 8px' }} onClick={handlePaste}>Paste from System</button>
        <button className="win-button" style={{ fontSize: 10, padding: '1px 8px' }} onClick={() => setClipText('')}>Clear</button>
      </div>
      <div className="win-sunken-deep" style={{ background: '#fff', margin: 4, flex: 1, overflow: 'auto', padding: 8 }}>
        <pre style={{ fontSize: 12, fontFamily: 'Courier New, monospace', whiteSpace: 'pre-wrap', margin: 0 }}>
          {clipText}
        </pre>
      </div>
      <div className="status-bar">
        <span className="status-section" style={{ flex: 1 }}>
          Clipboard Viewer - {clipText.length} characters
        </span>
      </div>
    </div>
  );
}

// ===================== MEDIA PLAYER =====================
export function MediaPlayerApp() {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration] = useState(180);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setPosition(p => {
          if (p >= duration) { setPlaying(false); return 0; }
          return p + 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, duration]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Display area */}
      <div className="win-sunken-deep" style={{ background: '#000', margin: 4, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
        <div style={{ color: '#00ff00', fontFamily: 'monospace', textAlign: 'center' }}>
          <div style={{ fontSize: 14 }}>🎵 Media Player</div>
          <div style={{ fontSize: 11, marginTop: 4, color: '#008000' }}>
            {playing ? '▶ Playing' : '■ Stopped'}
          </div>
          <div style={{ fontSize: 20, marginTop: 4 }}>
            {formatTime(position)}
          </div>
        </div>
      </div>
      {/* Slider */}
      <div style={{ padding: '2px 8px' }}>
        <input
          type="range"
          min={0}
          max={duration}
          value={position}
          onChange={e => setPosition(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#808080' }}>
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 2, padding: 4, borderTop: '1px solid #808080' }}>
        <button className="win-button" onClick={() => setPosition(0)} style={{ fontSize: 12, padding: '2px 8px' }}>⏮</button>
        <button className="win-button" onClick={() => setPosition(Math.max(0, position - 10))} style={{ fontSize: 12, padding: '2px 8px' }}>⏪</button>
        <button className="win-button" onClick={() => setPlaying(!playing)} style={{ fontSize: 12, padding: '2px 12px', fontWeight: 'bold' }}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="win-button" onClick={() => { setPlaying(false); setPosition(0); }} style={{ fontSize: 12, padding: '2px 8px' }}>⏹</button>
        <button className="win-button" onClick={() => setPosition(Math.min(duration, position + 10))} style={{ fontSize: 12, padding: '2px 8px' }}>⏩</button>
        <button className="win-button" onClick={() => setPosition(duration)} style={{ fontSize: 12, padding: '2px 8px' }}>⏭</button>
      </div>
    </div>
  );
}

// ===================== RECORDER =====================
export function RecorderApp() {
  const [recording, setRecording] = useState(false);
  const [events, setEvents] = useState<string[]>([
    'Mouse Click at (120, 45)',
    'Key Press: H',
    'Key Press: e',
    'Key Press: l',
    'Key Press: l',
    'Key Press: o',
    'Mouse Click at (200, 130)',
  ]);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleRecord = () => {
    if (recording) {
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setRecording(true);
      setEvents([]);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
  };

  useEffect(() => {
    if (recording) {
      const handler = (e: MouseEvent) => {
        setEvents(prev => [...prev, `Mouse Click at (${e.clientX}, ${e.clientY})`]);
      };
      const keyHandler = (e: KeyboardEvent) => {
        setEvents(prev => [...prev, `Key Press: ${e.key}`]);
      };
      window.addEventListener('click', handler);
      window.addEventListener('keydown', keyHandler);
      return () => {
        window.removeEventListener('click', handler);
        window.removeEventListener('keydown', keyHandler);
      };
    }
  }, [recording]);

  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 4, padding: 4, borderBottom: '1px solid #808080', alignItems: 'center' }}>
        <button className="win-button" onClick={toggleRecord} style={{ fontSize: 10, padding: '1px 8px', color: recording ? '#ff0000' : undefined }}>
          {recording ? '⏹ Stop' : '⏺ Record'}
        </button>
        <button className="win-button" style={{ fontSize: 10, padding: '1px 8px' }} onClick={() => setEvents([])}>Clear</button>
        {recording && <span style={{ fontSize: 10, color: '#ff0000', marginLeft: 'auto' }}>● Recording... {elapsed}s</span>}
      </div>
      <div className="win-sunken-deep" style={{ background: '#fff', margin: 4, flex: 1, overflow: 'auto', padding: 4 }}>
        {events.length === 0 ? (
          <div style={{ color: '#808080', fontSize: 11, padding: 8 }}>No events recorded. Click Record to start.</div>
        ) : events.map((ev, i) => (
          <div key={i} style={{ fontSize: 10, padding: '1px 4px', fontFamily: 'monospace', borderBottom: '1px solid #f0f0f0' }}>
            {String(i + 1).padStart(3, ' ')}. {ev}
          </div>
        ))}
      </div>
      <div className="status-bar">
        <span className="status-section" style={{ flex: 1 }}>{events.length} events recorded</span>
      </div>
    </div>
  );
}

// ===================== WINDOWS SETUP =====================
export function WindowsSetupApp() {
  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column', padding: 8 }}>
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
          <div style={{ width: 24, height: 24, background: '#ff0000' }} />
          <div style={{ width: 24, height: 24, background: '#00aa00' }} />
          <div style={{ width: 24, height: 24, background: '#0000ff' }} />
          <div style={{ width: 24, height: 24, background: '#ffff00' }} />
        </div>
        <div style={{ fontWeight: 'bold', fontSize: 14 }}>Microsoft Windows 3.1 Setup</div>
      </div>
      <div className="win-sunken-deep" style={{ background: '#fff', flex: 1, padding: 12, fontSize: 11 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['Display:', 'VGA (640x480, 16 colors)'],
              ['Keyboard:', 'Enhanced 101 or 102 key US'],
              ['Mouse:', 'Microsoft or IBM PS/2'],
              ['Network:', 'No Network Installed'],
              ['Swap File:', 'Permanent (16,384 KB)'],
              ['DOS Version:', '6.22'],
              ['Processor:', '80386'],
              ['Math Coprocessor:', 'Not present'],
              ['Free Memory:', '13,312 KB'],
              ['Free Disk Space:', '504 MB'],
              ['Windows Directory:', 'C:\\WINDOWS'],
              ['System Directory:', 'C:\\WINDOWS\\SYSTEM'],
              ['Temp Directory:', 'C:\\WINDOWS\\TEMP'],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: '3px 8px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{label}</td>
                <td style={{ padding: '3px 8px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
        <button className="win-button" style={{ padding: '3px 16px', fontSize: 11 }}>Options...</button>
        <button className="win-button" style={{ padding: '3px 16px', fontSize: 11 }}>Change System Settings...</button>
      </div>
    </div>
  );
}

// ===================== README =====================
export function ReadmeApp() {
  return (
    <div style={{ background: '#c0c0c0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="win-sunken-deep" style={{ background: '#fff', margin: 4, flex: 1, overflow: 'auto', padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          Microsoft Windows Version 3.1
        </div>
        <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>
          README.WRI
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.6 }}>
          <p style={{ marginBottom: 8 }}>Welcome to Microsoft Windows version 3.1!</p>
          <p style={{ marginBottom: 8 }}>This document contains important information not available in the Microsoft Windows User's Guide or in online Help.</p>

          <p style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>1. SYSTEM REQUIREMENTS</p>
          <p style={{ marginBottom: 8 }}>To run Windows 3.1, you need:</p>
          <ul style={{ marginLeft: 20, marginBottom: 8 }}>
            <li>Personal computer with 80286 or higher processor</li>
            <li>At least 1 MB of memory (2 MB recommended)</li>
            <li>Hard disk with 6.5 MB free space (10 MB recommended)</li>
            <li>One 3.5" or 5.25" floppy disk drive</li>
            <li>EGA, VGA, or compatible display</li>
            <li>MS-DOS version 3.1 or later</li>
          </ul>

          <p style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>2. NEW FEATURES</p>
          <ul style={{ marginLeft: 20, marginBottom: 8 }}>
            <li>TrueType font technology</li>
            <li>Object Linking and Embedding (OLE)</li>
            <li>Improved File Manager</li>
            <li>Drag and Drop support</li>
            <li>Multimedia extensions</li>
            <li>Enhanced screen savers</li>
          </ul>

          <p style={{ fontWeight: 'bold', marginBottom: 4, marginTop: 12 }}>3. KNOWN ISSUES</p>
          <p style={{ marginBottom: 8 }}>For the most current information about known compatibility issues, please refer to the SETUP.TXT and NETWORKS.WRI files.</p>

          <p style={{ marginTop: 16, color: '#808080', fontSize: 10 }}>
            Copyright © 1985-1992 Microsoft Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// ===================== NOTEPAD =====================
export function NotepadApp() {
  const [text, setText] = useState(
    'Welcome to Windows 3.1!\r\n\r\n' +
    'This is a recreation of the classic\r\n' +
    'Windows 3.1 desktop experience.\r\n\r\n' +
    'Try opening windows, dragging them\r\n' +
    'around, and exploring the apps!\r\n\r\n' +
    'Available applications:\r\n' +
    '  - File Manager (browse files)\r\n' +
    '  - Calculator (fully functional)\r\n' +
    '  - Minesweeper (playable game)\r\n' +
    '  - Solitaire (card game)\r\n' +
    '  - Paintbrush (draw on canvas)\r\n' +
    '  - Clock (analog clock)\r\n' +
    '  - Calendar (monthly view)\r\n' +
    '  - MS-DOS Prompt (command line)\r\n' +
    '  - And more!'
  );
  return (
    <div className="h-full flex flex-col">
      <textarea
        className="flex-1 resize-none outline-none border-none p-1 font-mono"
        style={{
          fontSize: 12, background: '#fff', color: '#000',
          margin: 2, border: '2px inset #808080',
          fontFamily: 'Courier New, monospace',
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
