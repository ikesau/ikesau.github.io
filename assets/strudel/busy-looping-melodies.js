const bSeed = "<0 0 0 3>".add("<2 1>/4");
const notes = note(
  perlin.range(0, 7).seg(16).rib(bSeed, 1).sub(6),
)
  // .mask(irand(2).seg(8).rib(2,1))
  .scale("C:major");

$: notes
  .sound("xylo")
  .decay(1 / 8)
  .transpose("12");
$: notes.sound("mallets").late(0).dec(0.1).release(0.1);

$: sound("hh*8").fit().gain(0.2).hpf(3000);
$: sound("bd*4").lpf(400);
