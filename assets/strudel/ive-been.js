setcpm(160 / 4);

$: sound("<ocean:3*2 [ocean:4 | ocean:3]>")
  .fit()
  .late(0.5)
  .room(1)
  .chop(8)
  .dec(0.2)
  .phaser(2)
  .gain(2)
  .o(2);

$: note("<[C,E,G] [A,C,E]>/4")
  .sound("tri")
  .tremdepth(2)
  .tremolosync("<8 12 16>")
  .trem(3)
  .tremshape("sine")
  .gain(3)
  .o(2);

$: stack(
  sound("bd*4").duck(2).duckatt(0.2),
  sound("hh*16").gain("<.3 .2 .3>*16"),
  sound("sd")
    .late(1 / 2)
    .sometimes((x) => x.delay(1.4))
    .dist("4:.3")
    .clip(1 / 16),
).bank("vintage");
