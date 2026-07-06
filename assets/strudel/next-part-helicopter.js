$: note("<C2!4 A0!4>*4".add(28))
  .sound("sine")
  .gain(2)
  .decay(1)
  .o(2);

$: note("<C2!4 A0!4>*4")
  .sound("sine")
  .gain(2)
  .decay(1)
  .o(2);

$: sound("bd*15")
  .lpf(slider(1000, 200, 1000))
  .duck(2)
  .duckatt(0.001);

$: sound("hh*8").hpf(2000);

$: sound("- - - sd").hpf(2000);
