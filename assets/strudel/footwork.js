setcpm(160 / 4);
samples('github:switchangel/pad');
$: s("[hh hh oh oh]*4").gain(0.8).dec(0.1);
$: s("bd, swpad:1")
  .begin(stack("0", rand.range(0, 0.5).seg(16).rib(2, 1)))
  .speed("<1!3 [.6 .7 .8 .9]>/4")
  .beat("0,6,12", 16)
  .fast(2)
  .dec(1)
  .rel(0.5)
  .dist("4:.3");
$: s("rim")
  .beat("16 | [16,22,[28,30]?]", 32)
  .gain("5")
  .speed(1.3)
  .dec(0.05)
  .hpf(400);
$: s("tr808_rim:2*16").mask(irand(2).seg(16).ribbon(0, 1));
