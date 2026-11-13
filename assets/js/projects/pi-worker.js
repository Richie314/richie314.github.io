/* Numerical work is isolated from the page so it can be cancelled immediately. */
'use strict';

self.onmessage = ({ data }) => {
  try {
    const { method, terms } = data;
    const maximum = { leibniz: 1000000, ramanujan: 20, chudnovsky: 12 }[method];
    if (!maximum || !Number.isInteger(terms) || terms < 1 || terms > maximum) {
      throw new Error('Choose a valid number of terms.');
    }
    if (method === 'leibniz') {
      // Compensated summation reduces floating-point error in the alternating sum.
      let sum = 0, correction = 0;
      for (let k = 0; k < terms; k++) {
        const value = (k % 2 === 0 ? 1 : -1) / (2 * k + 1) - correction;
        const next = sum + value;
        correction = (next - sum) - value;
        sum = next;
        if ((k + 1) % 10000 === 0) {
          self.postMessage({ type: 'progress', completed: k + 1, terms });
        }
      }
      self.postMessage({ type: 'result', estimate: (4 * sum).toPrecision(16), bound: 4 / (2 * terms + 1), terms });
      return;
    }

    importScripts('../libraries/decimal.js');
    // A separate constructor avoids changing precision in any other calculation.
    const precision = (method === 'ramanujan' ? 8 : 15) * terms + 25;
    const D = Decimal.clone({ precision });
    let coefficient = new D(1), sum = new D(0);
    for (let k = 0; k < terms; k++) {
      const linear = method === 'ramanujan' ? new D(26390).times(k).plus(1103) : new D(545140134).times(k).plus(13591409);
      sum = sum.plus(coefficient.times(linear));
      self.postMessage({ type: 'progress', completed: k + 1, terms });
      if (k + 1 === terms) break;
      if (method === 'ramanujan') {
        for (let j = 1; j <= 4; j++) coefficient = coefficient.times(4 * k + j);
        coefficient = coefficient.div(new D(k + 1).pow(4).times(new D(396).pow(4)));
      } else {
        for (let j = 1; j <= 6; j++) coefficient = coefficient.times(6 * k + j);
        for (let j = 1; j <= 3; j++) coefficient = coefficient.div(3 * k + j);
        coefficient = coefficient.div(new D(k + 1).pow(3).times(new D(640320).pow(3).negated()));
      }
    }
    const result = method === 'ramanujan'
      ? new D(9801).div(new D(2).times(new D(2).sqrt()).times(sum))
      : new D(426880).times(new D(10005).sqrt()).div(sum);
    // Keep some guard digits out of the display; this is still a finite series.
    const decimals = Math.min(200, (method === 'ramanujan' ? 8 : 14) * terms + 2);
    self.postMessage({ type: 'result', estimate: result.toFixed(decimals), precision, terms });
  } catch (error) {
    self.postMessage({ type: 'error', message: error.message || 'The calculation could not finish.' });
  }
};
