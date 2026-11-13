Malus's law experiment - data provenance

Author: Riccardo Ciucci, academic year 2021–22.
Source: the author’s original experiment report and measurement workbook.
Apparatus and circuit illustrations: extracted from the original PowerPoint presentation.

measurements.csv contains all 65 voltage readings from the five sheets of the main workbook.
Preliminary exploratory measurements are not used in the article.
Only the angle and voltage columns are original observations; other numeric columns are derived.
No data points have been excluded, including Set 4's two flagged endpoints.
The notes for Set 4 suggest filter positioning errors at the first and last readings.

series:
  set-4 = fourth measurement sheet, rows 6–18
  laser-control = single-filter laser control sheet, rows 8–20
  set-1 = sheet "Set 1", rows 6–18
  set-2 = sheet "Set 2", rows 6–18
  set-3 = sheet "Set 3", rows 6–18

angle_deg: original recorded angle in degrees.
voltage_v: original recorded voltage across the LDR, in volts.
resistance_kohm: 100 * voltage_v / (5 - voltage_v), using the nominal 5 V supply and 100 kOhm fixed resistor.
inverse_ratio: minimum resistance in the series / resistance_kohm.
exponential_ratio: exp(beta_per_kohm * (minimum resistance - resistance_kohm)).
malus_ratio: cos(angle_deg * pi / 180)^2; theoretical prediction for the two-filter runs.
beta_per_kohm: 0.47 for Sets 1–3 and 0.07 for Set 4, as stored in the workbook.
Exponential, beta, and Malus columns are blank for the single-filter laser control.
Its inverse_ratio is only a normalized detector proxy, not calibrated light intensity.

Each series is normalized to its own inferred maximum, rather than to the separate one-filter reference reading.
The plots use the workbook beta values without refitting.
All plotted uncertainty bars are horizontal, ±2 degrees, from the original report's angle estimate.
No vertical uncertainties are supplied because the source lacks an independent detector calibration and a full measurement uncertainty budget.
The Set 4 plot subtracts 180 degrees from recorded angles for display; the CSV retains the original angles.
The laser-control plot has a vertical axis starting at 75 percent.

The article's RMSE values are new, unweighted calculations over all 13 points in each two-filter series:
  sqrt(mean((converted_ratio - malus_ratio)^2)).
They quantify descriptive disagreement, not statistical significance or calibration accuracy.
