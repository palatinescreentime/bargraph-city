import { useState, useMemo } from "react";

const CATEGORIES = {
  "Bar & Pub":     { color: "#a78bfa" },
  "Sports Bar":    { color: "#60a5fa" },
  "Live Music":    { color: "#e879f9" },
  "Brewery":       { color: "#fb923c" },
  "Wine Bar":      { color: "#f472b6" },
  "American":      { color: "#fbbf24" },
  "Mexican":       { color: "#f97316" },
  "Italian":       { color: "#34d399" },
  "Pizza":         { color: "#f43f5e" },
  "German":        { color: "#94a3b8" },
  "Sushi & Asian": { color: "#22d3ee" },
  "BBQ":           { color: "#ef4444" },
  "International": { color: "#c084fc" },
};

// X: SKETCHY (-5) → CLASSY (+5)
// Y: JUST DRINKS (-5) → DESTINATION DINING (+5)
// Positions deliberately staggered — no two share the same x OR y value
const ALL_BARS = [
  // Bar & Pub
  { name: "Lamplighter Inn",       address: "60 N Bothwell St",       cat: "Bar & Pub",     price: 5,  x: -3.7, y: -1.6 },
  { name: "TJ O'Brien's",          address: "53 W Slade St",          cat: "Bar & Pub",     price: 6,  x: -2.4, y: -0.6 },
  { name: "Donkey Inn",            address: "923 S Plum Grove Rd",    cat: "Bar & Pub",     price: 7,  x: -1.2, y:  1.9 },
  { name: "Alley 64",              address: "2001 N Rand Rd",         cat: "Bar & Pub",     price: 5,  x: -2.9, y: -1.1 },
  { name: "Clifford's Pub",        address: "1503 N Rand Rd",         cat: "Bar & Pub",     price: 4,  x: -4.6, y: -3.8 },
  { name: "Gentlemen Billiards",   address: "1170 E Dundee Rd",       cat: "Bar & Pub",     price: 10, x:  3.8, y: -2.1 },
  // Sports Bar
  { name: "Hot Pockets",           address: "365 W Northwest Hwy",    cat: "Sports Bar",    price: 7,  x: -3.2, y: -2.7 },
  { name: "JL's Pizza & Sports",   address: "19 N Bothwell St",       cat: "Sports Bar",    price: 6,  x: -1.8, y:  0.9 },
  { name: "Quentin Tap",           address: "783 N Quentin Rd",       cat: "Sports Bar",    price: 8,  x:  0.4, y:  1.6 },
  { name: "Gators Wing Shack",     address: "1719 N Rand Rd",         cat: "Sports Bar",    price: 8,  x: -2.1, y:  0.3 },
  // Live Music
  { name: "Madcats",               address: "117 W Slade St",         cat: "Live Music",    price: 10, x:  1.6, y: -2.9 },
  { name: "Durty Nellie's",        address: "180 N Smith St",         cat: "Live Music",    price: 11, x:  0.9, y:  0.6 },
  // Brewery
  { name: "Emmett's Brewing",      address: "110 N Brockway St",      cat: "Brewery",       price: 11, x:  1.3, y:  2.4 },
  // Wine Bar
  { name: "The Cork @ CCF",        address: "34 Palatine Rd",         cat: "Wine Bar",      price: 13, x:  4.1, y:  1.7 },
  // American
  { name: "Tap House Grill",       address: "56 W Wilson St",         cat: "American",      price: 12, x:  2.3, y:  2.6 },
  { name: "Brandt's",              address: "807 W Northwest Hwy",    cat: "American",      price: 9,  x:  0.7, y:  2.0 },
  // Mexican
  { name: "One Taco Dos Tequilas", address: "375 W Northwest Hwy",    cat: "Mexican",       price: 10, x:  1.4, y:  2.3 },
  { name: "No Manches",            address: "1639 N Baldwin Rd",      cat: "Mexican",       price: 9,  x:  0.5, y:  1.4 },
  { name: "Mexico Uno",            address: "15 N Brockway St",       cat: "Mexican",       price: 7,  x: -0.9, y:  2.2 },
  { name: "Tacos El Norte",        address: "1324 N Rand Rd",         cat: "Mexican",       price: 7,  x: -0.2, y:  2.9 },
  { name: "Salsa Street",          address: "1540 N Rand Rd",         cat: "Mexican",       price: 7,  x:  0.1, y:  1.2 },
  { name: "A mi Manera",           address: "1910 N Rand Rd",         cat: "Mexican",       price: 8,  x:  1.1, y:  2.8 },
  { name: "Fronteras Mex Grill",   address: "2379 N Hicks Rd",        cat: "Mexican",       price: 6,  x:  0.6, y:  3.3 },
  // Italian
  { name: "Gianni's Cafe",         address: "18 W Station St",        cat: "Italian",       price: 13, x:  3.6, y:  4.1 },
  { name: "Agio Italian Bistro",   address: "64 S Northwest Hwy",     cat: "Italian",       price: 14, x:  4.3, y:  4.6 },
  // Pizza
  { name: "Tievoli Pizza Bar",     address: "44 W Palatine Rd",       cat: "Pizza",         price: 11, x:  2.8, y:  3.7 },
  { name: "JJ Twigs",              address: "150 S Northwest Hwy",    cat: "Pizza",         price: 8,  x:  0.3, y:  2.2 },
  { name: "Pizza Bella",           address: "16 N Brockway St",       cat: "Pizza",         price: 9,  x:  1.7, y:  2.7 },
  // German
  { name: "Schnell's Brauhaus",    address: "45 W Slade St",          cat: "German",        price: 11, x:  2.2, y:  3.2 },
  // Sushi & Asian
  { name: "Asahi Japanese",        address: "851 N Quentin Rd",       cat: "Sushi & Asian", price: 10, x:  2.6, y:  3.6 },
  { name: "Sushi Para",            address: "1268 E Dundee Rd",       cat: "Sushi & Asian", price: 11, x:  2.1, y:  4.2 },
  { name: "KIMPRO Sushi",          address: "23 E Northwest Hwy",     cat: "Sushi & Asian", price: 10, x:  1.9, y:  3.4 },
  { name: "Sushi Plus Thai",       address: "309 E Northwest Hwy",    cat: "Sushi & Asian", price: 10, x:  3.2, y:  4.3 },
  // BBQ
  { name: "Chicago Culinary BBQ",  address: "2391 N Hicks Rd",        cat: "BBQ",           price: 8,  x: -0.6, y:  3.1 },
  // International
  { name: "Bendita Cocina",        address: "16 S Bothwell St",       cat: "International", price: 12, x:  3.3, y:  3.8 },
  { name: "India Foodie Lounge",   address: "383 W Northwest Hwy",    cat: "International", price: 11, x:  3.0, y:  4.4 },
];

const W = 720, H = 560;
const PAD = { left: 80, right: 80, top: 30, bottom: 28 };
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;
const CX = PAD.left + CW / 2;
const CY = PAD.top  + CH / 2;
const RANGE = 5.4;

function toSvgX(x) { return CX + (x / RANGE) * (CW / 2); }
function toSvgY(y) { return CY - (y / RANGE) * (CH / 2); }

const MIN_PRICE = 4, MAX_PRICE = 14, MIN_R = 4, MAX_R = 13;
function radius(p) {
  return MIN_R + Math.min(1, Math.max(0, (p - MIN_PRICE) / (MAX_PRICE - MIN_PRICE))) * (MAX_R - MIN_R);
}

function labelAnchor(x) { return x > 2.5 ? "end" : "start"; }
function labelDx(x, r)  { return x > 2.5 ? -(r + 5) : r + 5; }

const FONT = "'Inter','Helvetica Neue',Arial,sans-serif";

// Theme palettes
const DARK = {
  bg:         "#000000",
  grid:       "#181818",
  box:        "#282828",
  axis:       "#3a3a3a",
  axisArrow:  "#3a3a3a",
  axisLabel:  "#555",
  quadLabel:  "rgba(255,255,255,0.04)",
  dimDot:     "#2a2a2a",
  labelDef:   "#bbb",
  tooltip:    "#111",
  ttBorder:   "66",
  ttText:     "#aaa",
  ttSub:      "#3a3a3a",
  filterDef:  "#555",
  filterBrd:  "#2a2a2a",
  filterHov:  "#aaa",
  legendTxt:  "#444",
  countText:  "#3a3a3a",
  titleColor: "#ffffff",
};
const LIGHT = {
  bg:         "#f8f6f1",
  grid:       "#e5e2da",
  box:        "#d8d4cc",
  axis:       "#aaa89f",
  axisArrow:  "#aaa89f",
  axisLabel:  "#888",
  quadLabel:  "rgba(0,0,0,0.04)",
  dimDot:     "#d0ccc4",
  labelDef:   "#444",
  tooltip:    "#fff",
  ttBorder:   "aa",
  ttText:     "#555",
  ttSub:      "#bbb",
  filterDef:  "#888",
  filterBrd:  "#ccc",
  filterHov:  "#333",
  legendTxt:  "#888",
  countText:  "#ccc",
  titleColor: "#111111",
};

export default function BarGraph() {
  const [hovered, setHovered]     = useState(null);
  const [activeTypes, setActiveTypes] = useState(new Set());
  const [dark, setDark]           = useState(true);
  const T = dark ? DARK : LIGHT;
  const allCats = Object.keys(CATEGORIES);

  function toggleType(cat) {
    setActiveTypes(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const visibleBars = useMemo(() =>
    activeTypes.size === 0 ? ALL_BARS : ALL_BARS.filter(b => activeTypes.has(b.cat)),
    [activeTypes]);

  const dimmedBars = useMemo(() =>
    activeTypes.size === 0 ? [] : ALL_BARS.filter(b => !activeTypes.has(b.cat)),
    [activeTypes]);

  return (
    <div style={{
      background: T.bg,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 12px",
      fontFamily: FONT,
      transition: "background 0.3s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

        .bubble     { cursor: pointer; }
        .bubble-pop { animation: popIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
        .fade-up    { animation: fadeUp 0.45s ease both; }

        .filter-btn {
          border-radius: 20px;
          padding: 4px 11px;
          font-size: 11px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s ease;
          background: transparent;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .filter-btn.active { color: #000 !important; border-color: transparent; font-weight: 600; }

        .mode-toggle {
          background: transparent;
          border: 1px solid;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* TITLE + TOGGLE */}
      <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16, flexWrap:"wrap", justifyContent:"center" }}>
        <div style={{
          fontFamily: "'Impact','Arial Black',sans-serif",
          fontSize: "clamp(30px,5.5vw,56px)",
          letterSpacing: "0.06em",
          color: T.titleColor,
          transition: "color 0.3s",
        }}>
          THE <span style={{ color:"#4ab8e8" }}>BAR</span> GRAPH
        </div>

        {/* Light/Dark toggle */}
        <button className="mode-toggle"
          onClick={() => setDark(d => !d)}
          style={{
            borderColor: dark ? "#444" : "#bbb",
            color: dark ? "#888" : "#666",
          }}>
          {dark ? "☀ Light mode" : "☾ Dark mode"}
        </button>
      </div>

      <div style={{ color: T.countText, fontSize:"10px", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:10, transition:"color 0.3s" }}>
        Palatine, Illinois · {ALL_BARS.length} spots
      </div>

      <div style={{ position:"relative", width:W, maxWidth:"100%" }}>

        {/* Tooltip */}
        {hovered && (() => {
          const sx  = toSvgX(hovered.x), sy = toSvgY(hovered.y);
          const r   = radius(hovered.price);
          const gc  = CATEGORIES[hovered.cat].color;
          const left = sx > W * 0.6 ? sx - r - 190 : sx + r + 14;
          return (
            <div style={{
              position:"absolute", left, top: Math.max(0, sy - 52),
              background: T.tooltip,
              border:`1px solid ${gc}${T.ttBorder}`,
              borderRadius:7, padding:"10px 14px",
              pointerEvents:"none", zIndex:20, minWidth:170,
              boxShadow:`0 6px 24px rgba(0,0,0,${dark?0.85:0.15})`,
              animation:"fadeUp 0.1s ease both",
              transition:"background 0.3s",
            }}>
              <div style={{ color:gc, fontWeight:600, fontSize:13, marginBottom:5 }}>{hovered.name}</div>
              <div style={{ color:T.ttText, fontSize:11, lineHeight:1.9, transition:"color 0.3s" }}>
                <div>🏷 {hovered.cat}</div>
                <div>💰 ~${hovered.price} avg drink</div>
                <div style={{ color:T.ttSub, fontSize:9, marginTop:3 }}>{hovered.address}</div>
              </div>
            </div>
          );
        })()}

        {/* SVG */}
        <svg width={W} height={H} style={{ display:"block", overflow:"visible" }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[-4,-3,-2,-1,1,2,3,4].map(v => (
            <g key={v}>
              <line x1={toSvgX(v)} y1={PAD.top} x2={toSvgX(v)} y2={PAD.top+CH} stroke={T.grid} strokeWidth={1}/>
              <line x1={PAD.left} y1={toSvgY(v)} x2={PAD.left+CW} y2={toSvgY(v)} stroke={T.grid} strokeWidth={1}/>
            </g>
          ))}

          <rect x={PAD.left} y={PAD.top} width={CW} height={CH} fill="none" stroke={T.box} strokeWidth={1}/>

          {/* Axes */}
          <line x1={PAD.left} y1={CY} x2={PAD.left+CW} y2={CY} stroke={T.axis} strokeWidth={1.5}/>
          <line x1={CX} y1={PAD.top} x2={CX} y2={PAD.top+CH} stroke={T.axis} strokeWidth={1.5}/>

          {/* Arrows */}
          <polygon points={`${CX},${PAD.top-7} ${CX-5},${PAD.top+6} ${CX+5},${PAD.top+6}`} fill={T.axisArrow}/>
          <polygon points={`${CX},${PAD.top+CH+7} ${CX-5},${PAD.top+CH-6} ${CX+5},${PAD.top+CH-6}`} fill={T.axisArrow}/>
          <polygon points={`${PAD.left-7},${CY} ${PAD.left+6},${CY-5} ${PAD.left+6},${CY+5}`} fill={T.axisArrow}/>
          <polygon points={`${PAD.left+CW+7},${CY} ${PAD.left+CW-6},${CY-5} ${PAD.left+CW-6},${CY+5}`} fill={T.axisArrow}/>

          {/* Axis labels */}
          <text x={PAD.left-10} y={CY+4} textAnchor="end"   fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.25em" fontWeight="600">SKETCHY</text>
          <text x={PAD.left+CW+10} y={CY+4} textAnchor="start" fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.25em" fontWeight="600">CLASSY</text>
          <text x={CX} y={PAD.top-14} textAnchor="middle"   fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.22em" fontWeight="600">DESTINATION DINING</text>
          <text x={CX} y={PAD.top+CH+18} textAnchor="middle" fill={T.axisLabel} fontSize={11} fontFamily={FONT} letterSpacing="0.25em" fontWeight="600">JUST DRINKS</text>

          {/* Ghost quadrant labels */}
          <text x={toSvgX(4.6)} y={toSvgY(4.6)} textAnchor="end"   fill={T.quadLabel} fontSize={11} fontStyle="italic">Classy & delicious</text>
          <text x={toSvgX(-4.6)} y={toSvgY(4.6)} textAnchor="start" fill={T.quadLabel} fontSize={11} fontStyle="italic">Hidden gem eats</text>
          <text x={toSvgX(4.6)} y={toSvgY(-4.6)} textAnchor="end"   fill={T.quadLabel} fontSize={11} fontStyle="italic">Swanky scene</text>
          <text x={toSvgX(-4.6)} y={toSvgY(-4.6)} textAnchor="start" fill={T.quadLabel} fontSize={11} fontStyle="italic">Classic dive</text>

          {/* Dimmed dots */}
          {dimmedBars.map(bar => (
            <circle key={"dim-"+bar.name}
              cx={toSvgX(bar.x)} cy={toSvgY(bar.y)} r={radius(bar.price)}
              fill={T.dimDot} opacity={0.55}/>
          ))}

          {/* Active bubbles */}
          {visibleBars.map((bar, i) => {
            const sx = toSvgX(bar.x), sy = toSvgY(bar.y), r = radius(bar.price);
            const col = CATEGORIES[bar.cat].color;
            const isH = hovered?.name === bar.name;
            return (
              <g key={bar.name}
                className="bubble bubble-pop"
                style={{ transformOrigin:`${sx}px ${sy}px`, animationDelay:`${i*0.032}s` }}
                onMouseEnter={() => setHovered(bar)}
                onMouseLeave={() => setHovered(null)}
              >
                {isH && <circle cx={sx} cy={sy} r={r+12} fill={col} opacity={0.13} filter="url(#glow)"/>}
                <circle cx={sx} cy={sy} r={r} fill={col} opacity={isH ? 1 : 0.85} style={{ transition:"opacity 0.15s" }}/>
                <circle cx={sx-r*0.3} cy={sy-r*0.3} r={r*0.27} fill="white" opacity={dark ? 0.22 : 0.35}/>
                <text x={sx+labelDx(bar.x,r)} y={sy+4}
                  textAnchor={labelAnchor(bar.x)}
                  fill={isH ? col : T.labelDef}
                  fontSize={10} fontFamily={FONT}
                  fontWeight={isH ? "600" : "400"}
                  style={{ transition:"fill 0.15s", pointerEvents:"none" }}>
                  {bar.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* FILTER BUTTONS */}
        <div style={{ marginTop:12, paddingLeft:PAD.left, paddingRight:PAD.right }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap", marginBottom:10 }}>
            <span style={{ color:T.legendTxt, fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", marginRight:2, flexShrink:0, transition:"color 0.3s" }}>
              Filter:
            </span>
            <button
              className={`filter-btn ${activeTypes.size===0?"active":""}`}
              style={{
                border:`1px solid ${activeTypes.size===0?"transparent":T.filterBrd}`,
                color: activeTypes.size===0 ? "#000" : T.filterDef,
                background: activeTypes.size===0 ? "#fff" : "transparent",
                transition:"all 0.15s",
              }}
              onClick={() => setActiveTypes(new Set())}
            >
              All ({ALL_BARS.length})
            </button>
            {allCats.map(cat => {
              const count  = ALL_BARS.filter(b => b.cat === cat).length;
              const active = activeTypes.has(cat);
              const col    = CATEGORIES[cat].color;
              return (
                <button key={cat}
                  className={`filter-btn ${active?"active":""}`}
                  style={{
                    border:`1px solid ${active ? col : T.filterBrd}`,
                    color: active ? "#000" : T.filterDef,
                    background: active ? col : "transparent",
                    transition:"all 0.15s",
                  }}
                  onClick={() => toggleType(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Size legend */}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ color:T.legendTxt, fontSize:10, transition:"color 0.3s" }}>
              Circle size = avg drink price:
            </span>
            {[4,7,10,14].map(p => {
              const r = radius(p), s = (MAX_R+4)*2;
              return (
                <svg key={p} width={s} height={s} style={{ flexShrink:0 }}>
                  <circle cx={s/2} cy={s/2} r={r} fill={dark?"#fff":"#888"} opacity={dark?0.25:0.3}/>
                </svg>
              );
            })}
            <span style={{ color:T.legendTxt, fontSize:10 }}>$4 → $14</span>
          </div>
        </div>
      </div>
    </div>
  );
}
