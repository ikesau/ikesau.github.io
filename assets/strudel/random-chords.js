$: irand(12)
  .seg(8)
  .rib(0, 2)
  .add("[3,5,7] | [0,2,9]")
  .fast(4)
  .scale("C3:minor")
  .note()
  .struct("<x - - x - - - ->*16")
  .sound("triangle")
  .release(1);

$: sound("r8_rd*6").gain(0.2);

$: sound("<- hh hh>*12");

$: sound("<- sine!2>*12").note("[C2]").gain(4);

$: sound("bd").lpf(200).gain(2);

$: sound("akaixr10_tb*16")
  .mask(irand(2))
  .ply(2)
  .gain(rand.range(0.2, 0.4));

$: sound("gm_bird_tweet:3").delay(2).delayt(0.1).delayfb(2);
