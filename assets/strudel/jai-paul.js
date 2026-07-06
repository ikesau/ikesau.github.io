$: note(
  irand(16)
    .scale("C:dorian")
    // or
    // .scale("<A:pentatonic, E:pentatonic>")
    .segment(8)
    .rib(6, 3)
    .sub(24),
)
  .sound("gm_celesta")
  .lpf(200)
  .mask(rand.segment(8).gt(0.3).rib(0, 2))
  .dist("4:.2")
  .ply("2")
  .delay(0.2);
