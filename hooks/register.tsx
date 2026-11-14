import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Brie Mine: butter-cream by day, a candlelit cheese cellar by night, pink for love.
const { theme, problems } = makeColors({
  label: 'Brie Mine',
  roles: { accent: '#d6337a', danger: '#c4422a', success: '#4f8a3a', warning: '#b7791f', pro: '#8a4fb3' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#f5e6b8',
        'surface-1': '#f9eecb',
        'surface-2': '#fcf5df',
        'text-primary': '#3a2a1a',
        'text-secondary': '#5c4430',
        'text-muted': '#6b533d',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1f1913',
        'surface-1': '#271f19',
        'surface-2': '#2f261f',
        'surface-3': '#352b23',
        'text-primary': '#f8ecd2',
        'text-secondary': '#dccdb0',
        'text-muted': '#b5a589',
      },
    },
  },
})

const SCENE_ID = 'brie-mine'

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: SCENE_ID, glass: { blur: 18, opacity: 0.62 } },
}

const heart = 'M0 6 C0 -2 12 -2 12 6 C12 -2 24 -2 24 6 C24 14 12 20 12 24 C12 20 0 14 0 6 Z'

// Cheese holes and little hearts drifting up the left and right edges, clear of the middle and the message box.
const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
  .base { fill: #f5e6b8; }
  .glow { fill: #fff6d8; opacity: .55; }
  .hole { fill: #e8cf86; }
  .hole-rim { fill: #fbefc6; }
  .heart { fill: #e45a95; }
  @media (prefers-color-scheme: dark) {
    .base { fill: #1f1913; }
    .glow { fill: #3a2c1c; opacity: .6; }
    .hole { fill: #2c231b; }
    .hole-rim { fill: #3b2f22; }
    .heart { fill: #c43d7a; }
  }
  .drift { animation: rise linear infinite; }
  .bob { animation: bob ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
  @keyframes rise { from { transform: translateY(1150px); } to { transform: translateY(-200px); } }
  @keyframes bob { from { transform: translateY(0) scale(1); } to { transform: translateY(-14px) scale(1.04); } }
  @media (prefers-reduced-motion: reduce) { .drift, .bob { animation: none; } }
</style>
<rect class="base" width="1600" height="1000"/>
<ellipse class="glow" cx="120" cy="140" rx="420" ry="300"/>
<ellipse class="glow" cx="1500" cy="860" rx="460" ry="320"/>

<g class="bob" style="animation-duration:7s">
  <circle class="hole-rim" cx="110" cy="210" r="62"/><circle class="hole" cx="114" cy="214" r="54"/>
</g>
<g class="bob" style="animation-duration:9s;animation-delay:-3s">
  <circle class="hole-rim" cx="250" cy="560" r="34"/><circle class="hole" cx="253" cy="563" r="28"/>
</g>
<g class="bob" style="animation-duration:8s;animation-delay:-5s">
  <circle class="hole-rim" cx="70" cy="820" r="46"/><circle class="hole" cx="73" cy="823" r="39"/>
</g>
<g class="bob" style="animation-duration:10s;animation-delay:-2s">
  <circle class="hole-rim" cx="1490" cy="150" r="48"/><circle class="hole" cx="1493" cy="153" r="41"/>
</g>
<g class="bob" style="animation-duration:7.5s;animation-delay:-6s">
  <circle class="hole-rim" cx="1370" cy="430" r="26"/><circle class="hole" cx="1372" cy="432" r="21"/>
</g>
<g class="bob" style="animation-duration:9.5s;animation-delay:-1s">
  <circle class="hole-rim" cx="1530" cy="660" r="70"/><circle class="hole" cx="1534" cy="665" r="61"/>
</g>

<g class="drift" style="animation-duration:26s"><path class="heart" d="${heart}" transform="translate(180 0) scale(1.1)" opacity=".55"/></g>
<g class="drift" style="animation-duration:34s;animation-delay:-12s"><path class="heart" d="${heart}" transform="translate(60 0) scale(.7)" opacity=".4"/></g>
<g class="drift" style="animation-duration:30s;animation-delay:-20s"><path class="heart" d="${heart}" transform="translate(300 0) scale(.85)" opacity=".45"/></g>
<g class="drift" style="animation-duration:28s;animation-delay:-6s"><path class="heart" d="${heart}" transform="translate(1420 0) scale(1)" opacity=".5"/></g>
<g class="drift" style="animation-duration:36s;animation-delay:-18s"><path class="heart" d="${heart}" transform="translate(1290 0) scale(.65)" opacity=".38"/></g>
<g class="drift" style="animation-duration:31s;animation-delay:-25s"><path class="heart" d="${heart}" transform="translate(1530 0) scale(.8)" opacity=".45"/></g>
</svg>`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_ID) {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Swiss cheese holes and little pink hearts drifting up the edges" isInteractive />
  })
}
