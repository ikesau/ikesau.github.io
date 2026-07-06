$: stack(
  sound("xylo*3")
    .note(irand(4))
    .scale("C4:minor:pentatonic"),
  sound("xylo*4")
    .note(irand(8))
    .scale("C4:minor:pentatonic"),
  sound("mallets")
    .note(irand(5))
    .scale("C2:minor:pentatonic")
    .lpf(600),
)
  .rib("<1 2 3 4>/2".add(4), "[0.5 | 0.75 | 1 | .25]/2")
  .gain(0.25);
