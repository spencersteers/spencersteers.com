import Typography from 'typography';

// https://kyleamathews.github.io/typography.js/
const typography = new Typography({
  baseFontSize: '18px',
  baseLineHeight: 1.666,
  headerFontFamily: ['-apple-system', 'sans-serif'],
  bodyFontFamily: ['-apple-system', 'sans-serif'],
  bodyColor: 'hsla(0, 0%, 100%, 0.9)',
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    'a, a:active, a:visited': {
      color: 'hsla(0, 0%, 100%, 0.9)',
    },
    'h2,h3': {
      marginTop: rhythm(1.75),
      marginBottom: rhythm(1),
    },
  }),
});

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
