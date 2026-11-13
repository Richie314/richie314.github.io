// The theme creates the Plotly charts; resize them when their article column changes.
window.addEventListener('load', () => {
  if (!window.Plotly || !window.ResizeObserver) return;
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const figure = entry.target;
      const width = Math.round(entry.contentRect.width);
      if (width === figure.plotWidth || width === 0) continue;
      figure.plotWidth = width;
      requestAnimationFrame(() => {
        figure.querySelectorAll('.js-plotly-plot').forEach((plot) => Plotly.Plots.resize(plot));
      });
    }
  });
  document.querySelectorAll('.malus-plot').forEach((figure) => observer.observe(figure));
});
