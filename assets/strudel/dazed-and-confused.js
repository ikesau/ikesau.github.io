$: note("<0 1 2 3 4 5 6 7>*2".add(30))
  .sound("sine")
  .revv()
  .release(2);

$: sound("rd - rd rd").bank("vintage").gain(0.2).swing(2);

$: sound("bd*2").bank("vintage");
