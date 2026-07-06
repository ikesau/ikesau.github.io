const pattern1 = sound("bd - - - bd bd - -");
const pattern2 = sound("bd - bd bd bd - - -");
const pattern3 = note("<C2 C3>*8");

stack(
  arrange([4, pattern1], [2, pattern2]),
  arrange([4, silence], [2, pattern3]),
);
