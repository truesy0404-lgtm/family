import { colorById } from './colors.js';

const SKIN = '#ecc6a6', HAIR = '#2a2220', INK = '#3a2e2a', LINE = 'rgba(58,46,42,.38)';
const hex = (c) => colorById(c)?.hex || c;

/**
 * 남편 캐릭터가 코디를 입은 전신 그림 (SVG 문자열).
 * 웃는 얼굴, 손은 주머니에, 주름 바지, 첼시부츠. 종이 같은 흰 배경.
 * o: { outer?, inner, bottom, shoes } 색 id. outer가 없으면 반팔 티셔츠만 입은 모습.
 */
export function manSVG(o, width = 150) {
  const inner = hex(o.inner), bottom = hex(o.bottom), shoes = hex(o.shoes);
  const outer = o.outer ? hex(o.outer) : null;
  const s = `stroke="${LINE}" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"`;
  const shade = 'rgba(0,0,0,.16)';

  const bareArms = outer ? '' :
    `<path d="M54 112 Q44 170 50 220 L66 226 Q62 180 68 120Z" fill="${SKIN}" ${s}/>
     <path d="M146 112 Q156 170 150 220 L134 226 Q138 180 132 120Z" fill="${SKIN}" ${s}/>`;

  const tee = `<path d="M68 100 Q100 92 132 100 L134 228 L66 228 Z" fill="${inner}" ${s}/>` +
    (outer ? '' : `<path d="M68 100 L47 112 L54 146 L70 134Z" fill="${inner}" ${s}/><path d="M132 100 L153 112 L146 146 L130 134Z" fill="${inner}" ${s}/>`) +
    `<path d="M88 94 Q100 108 112 94 Z" fill="${SKIN}" ${s}/><path d="M86 93 Q100 110 114 93" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="2.6"/>`;

  const jacket = !outer ? '' :
    `<path d="M62 98 L47 108 Q33 158 38 186 Q42 212 60 238 L76 228 Q62 206 62 182 Q62 150 68 126Z" fill="${outer}" ${s}/>
     <path d="M138 98 L153 108 Q167 158 162 186 Q158 212 140 238 L124 228 Q138 206 138 182 Q138 150 132 126Z" fill="${outer}" ${s}/>
     <path d="M62 98 L84 92 L90 100 L88 238 L56 236 Z" fill="${outer}" ${s}/>
     <path d="M138 98 L116 92 L110 100 L112 238 L144 236 Z" fill="${outer}" ${s}/>
     <path d="M60 238 L76 228 L80 236 L64 247Z M140 238 L124 228 L120 236 L136 247Z" fill="${shade}" ${s}/>
     <path d="M84 92 L93 97 L90 114 L76 100Z" fill="${outer}" ${s}/><path d="M116 92 L107 97 L110 114 L124 100Z" fill="${outer}" ${s}/>
     <path d="M66 128 H86 V140 L76 145 L66 140Z M114 128 H134 V140 L124 145 L114 140Z" fill="${shade}" ${s}/>
     <g fill="${INK}" opacity=".55"><circle cx="76" cy="138" r="1.8"/><circle cx="124" cy="138" r="1.8"/><circle cx="85" cy="156" r="1.6"/><circle cx="85" cy="180" r="1.6"/><circle cx="85" cy="204" r="1.6"/><circle cx="85" cy="226" r="1.6"/></g>`;

  return `<svg class="man" viewBox="0 0 200 430" width="${width}" height="${Math.round(width * 430 / 200)}" role="img" aria-label="코디한 모습">
    <rect width="200" height="430" fill="#f7f4ee"/>
    <ellipse cx="100" cy="414" rx="64" ry="6" fill="rgba(0,0,0,.12)"/>
    <path d="M44 420 L66 412 M120 421 L150 413 M78 424 L110 419 M150 424 L170 418" stroke="rgba(58,46,42,.1)" stroke-width="1" fill="none"/>
    <path d="M60 206 H140 L138 300 L130 386 H104 L101 246 H99 L96 386 H70 L62 300 Z" fill="${bottom}" ${s}/>
    <path d="M60 206 H140 V213 H60Z" fill="${shade}"/>
    <path d="M84 214 Q81 245 83 272 M116 214 Q119 245 117 272 M100 214 V246 M82 272 V384 M118 272 V384" fill="none" stroke="rgba(0,0,0,.2)"/>
    <path d="M64 216 Q73 230 75 248 M136 216 Q127 230 125 248" fill="none" stroke="rgba(0,0,0,.28)"/>
    <path d="M70 386 H98 L99 402 Q100 411 91 412 L66 412 Q57 411 60 404 Q68 402 70 386Z" fill="${shoes}" ${s}/>
    <path d="M130 386 H102 L101 402 Q100 411 109 412 L134 412 Q143 411 140 404 Q132 402 130 386Z" fill="${shoes}" ${s}/>
    <path d="M70 394 H98 M102 394 H130" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
    <path d="M58 411 H99 M101 411 H142" stroke="rgba(0,0,0,.55)" stroke-width="2.4"/>
    <rect x="91" y="72" width="18" height="24" fill="${SKIN}"/>
    ${bareArms}${tee}${jacket}
    ${outer ? '' : `<ellipse cx="60" cy="230" rx="7" ry="9" fill="${SKIN}" ${s}/><ellipse cx="140" cy="230" rx="7" ry="9" fill="${SKIN}" ${s}/>`}
    <ellipse cx="78" cy="50" rx="4" ry="6" fill="${SKIN}" ${s}/><ellipse cx="122" cy="50" rx="4" ry="6" fill="${SKIN}" ${s}/>
    <ellipse cx="100" cy="48" rx="22" ry="27" fill="${SKIN}" ${s}/>
    <path d="M77 50 Q70 18 98 13 Q128 11 124 46 Q126 34 118 29 Q108 37 96 31 Q86 35 82 43 Q79 45 77 50Z" fill="${HAIR}"/>
    <path d="M84 30 Q92 22 104 24 M100 22 Q112 20 118 28" fill="none" stroke="#4a3b36" stroke-width="1.2"/>
    <path d="M87 49 Q91 45 95 49 M105 49 Q109 45 113 49" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M86 43 Q91 41 96 43 M104 43 Q109 41 114 43" fill="none" stroke="${INK}" stroke-width="1.1"/>
    <path d="M91 61 Q100 72 109 61 Q100 64 91 61Z" fill="#fff" stroke="#8a4a40" stroke-width="1.2" stroke-linejoin="round"/>
    <ellipse cx="86" cy="58" rx="4" ry="2.4" fill="#e59c8e" opacity=".35"/><ellipse cx="114" cy="58" rx="4" ry="2.4" fill="#e59c8e" opacity=".35"/>
  </svg>`;
}
