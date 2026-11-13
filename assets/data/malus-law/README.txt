Malus's law experiment - data provenance

Author: Riccardo Ciucci, academic year 2021–22.
Sources: the final experimental report and its companion analysis workbook (laser control and Sets 1–3), plus a later measurement workbook (Set 4).
Apparatus and circuit illustrations: extracted from the original presentation.
Apparatus photographs: the author’s original experiment photographs, resized and re-encoded for web delivery.
The original report and workbooks are not distributed with this page.

measurements.csv contains 65 final averaged voltage readings from the five measurement series.
The 52 control and Set 1–3 angle/voltage pairs were checked against the final-analysis workbook and are identical to those already extracted from the later workbook.
Set 4 contributes a further 13 readings; it is supplementary to the final report.
Preliminary exploratory measurements are not used in the article.
Only the angle and voltage columns are original observations; other numeric columns are derived.
No data points have been excluded, including Set 4's two flagged endpoints.
The notes for Set 4 suggest filter positioning errors at the first and last readings.

series:
  laser-control = final-analysis workbook, first sheet, rows 8–20
  set-1 = final-analysis workbook, second sheet, rows 6–18
  set-2 = final-analysis workbook, third sheet, rows 6–18
  set-3 = final-analysis workbook, fourth sheet, rows 6–18
  set-4 = later workbook, first sheet, rows 6–18

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

Acquisition procedure documented by the May 11, 2022 firmware version:
  https://github.com/Richie314/Laser-and-LDR-control-arduino/tree/1ac3f8a48ef41d8dff3523d9001fcf88a9fc915a
  20 raw analog readings per group, with a 5 ms delay after each reading.
  Each group is sorted and the three lowest and three highest readings are discarded.
  The remaining 14 values form a trimmed mean.
  The mean of 20 such groups is reported: 400 acquired readings, with 280 retained in the trimmed means.
  The code specifies a 10 ms delay after the laser-on command and a 2 s pause between groups.
  Voltage conversion uses analogRead / 1024 * 5 V, with a nominal step of 4.88 mV before averaging.
These code settings describe the archived program, not a reconstruction of raw readings that are no longer available in the tables.
The final report identifies the filters as photographic CPL filters; the full orientation of their internal optical layers is not documented.
The cosine-squared traces are the ideal linear-polarizer benchmark used for comparison, not a fitted optical model of every element in the actual apparatus.
