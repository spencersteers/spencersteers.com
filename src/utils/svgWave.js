function buildWave(width, height, amp, repeat = 1) {
  var xStart = 0;
  var yStart = height * amp;

  var xMid = width / 2;
  var yMid = height * (1 - amp);

  var m = 0.512286623256592433;

  var moveCommand = `${xStart},${yStart}`;
  var relCubicCommand = `${xMid * m},0 ${xMid - xMid * m},${yMid - yStart} ${xMid -
    xStart}, ${yMid - yStart}`;
  var relCubicCommand2 = `${xMid - xMid * m},${yStart - yMid} ${xMid},${yStart - yMid}`;

  var waveRepeatCommand = '';
  for (var i = 0; i < repeat; ++i) {
    waveRepeatCommand += `c${relCubicCommand} s${relCubicCommand2}`;
  }

  return {
    M: moveCommand,
    c: relCubicCommand,
    s: relCubicCommand2,
    d: `M${moveCommand} ${waveRepeatCommand}`,
  };
}

function waveSVG(width, height, amp, color) {
  let wave = buildWave(width, height, amp, 2);
  let svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <style type="text/css">
        .animate-wave {
          animation: waveHorizontal 1s linear infinite;
        }
        @keyframes waveHorizontal {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${width}px);
          }
        }
      </style>
        <path
          class="animate-wave"
          stroke="${color}"
          stroke-width="1"
          stroke-linecap="round"
          fill="none"
          d="${wave.d}" />
    </svg>
  `;
  return svg;
}
