samples('github:switchangel/breaks');
samples('github:switchangel/pad');
samples('github:tidalcycles/Dirt-Samples');

setcpm(160 / 4);

$: s("breaks:3/2")
  .fit()
  .scrub(irand(16).div(16).seg(8).ribbon(2, 8))
  .o(4);

$: s("swpad:7")
  .scrub(irand(4).div(4).seg(2).ribbon(0, 2))
  .gain(0.5)
  .bpf(2000);

$: note("<C3 [E3 G3] A3 B3 D4>*[2, 2.01]")
  .scale("C:minor")
  .sound("piano")
  .gain(1)
  .room(1);

$: n(run(8).add(1))
  .sound("birds")
  .slow(10)
  .speed(0.7)
  .room(2)
  .gain(2)
  .delay(0.5)
  .delayspeed(0.1);

$: sound("bd*2")
  .bank("tr808")
  .gain(2)
  .duck(1)
  .o(2)
  .duckatt(0.5);

$: sound("<rd rd rd - - - >*12").gain(0.5).o(3);

$: sound("xylophone_soft_ff")
  .note("C3 D3 [B3 | A3 | G3]")
  .euclid(3, 5)
  .gain(2)
  .scale("C:major");

$: sound("xylophone_soft_ff")
  .note("<G1 [G2 | G4]>")
  .euclid(2, 7)
  .gain(2)
  .scale("C:major");

$: n("<4! 11 24 18>*3").sound("alphabet").hpf(2000).o(3);

$: sound("- [rim:1 | rim:2] rim:5 -")
  .o(4)
  .sometimes((x) => x.ply(3))
  .dist("2:.2")
  .hpf(1000)
  .room(0.5);

$: sound("hh*16")
  .gain(4)
  .lpf(sine.range(4000, 10000))
  .gain(0.5);

$: sound("sine")
  .note("<C2, E3, G2> | <F3, A3, C3>")
  .gain(4);

all((x) => x.hpf(1000));
