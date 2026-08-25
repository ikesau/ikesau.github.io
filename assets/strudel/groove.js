$: sound("bd*4").hpf(80).hpq(10).gain(1).dec(.2)
  .gain(.25)
  .duck(2)
  .duckatt(1/3)
  .duckdepth(1)

$: sound("vintage_hh:1*16")
  .n(irand(5).seg(8).rib(2,1))
  .lpf(8000)
  .coarse(8)
  .late(2/4)
  .gain(.25)

$: sound("supersaw")
  .note("0 2 5")
  .scale("C1:pentatonic")
  .struct(irand(2).seg(16).rib(3,1)).dec(1).distort("4:.1:asym").o(2)

$: sound("[yamaharm50_cp -]*2").hpf(1000).coarse(4).gain(5).compressor("-10:20:0:0")