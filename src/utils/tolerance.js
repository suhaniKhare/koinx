exports.isWithinTimestampTolerance = (ts1, ts2, toleranceSeconds) => {
  const diff =
    Math.abs(new Date(ts1).getTime() - new Date(ts2).getTime()) / 1000;

  return diff <= toleranceSeconds;
};

exports.isWithinQuantityTolerance = (q1, q2, tolerancePct) => {
  const max = Math.max(q1, q2);

  if (max === 0) return true;

  const diffPct = (Math.abs(q1 - q2) / max) * 100;

  return diffPct <= tolerancePct;
};
