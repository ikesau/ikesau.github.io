sound("rim:2*16")
  .mask(irand(2).segment(8).rib(1, 1))
  .penv(irand(16).sub(8).seg(8).rib(0, 1))
  .patt(1)
  .decay(0.2)
  .dist("2:.2");
// or for full random
// .degradeBy(0.5)
