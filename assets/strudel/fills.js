$: sound("hh*8").when("<0@3 1>", (x) => x.fast(2));
// or
$: note("E3*4")
  .sound("sine")
  .rel(0.1)
  .dec(0.5)
  .every(2, (x) =>
    x
      .euclid(7, 16)
      .note("A2 C3 D3 E3")
      .off(1 / 16, (x) => x.add(note(7))),
  );
// or override struct
$: note("E3*4")
  .struct("x - - x - - x - - x - - x - - x")
  .every(2, (_) => note("A2 C3 D3 E3").struct("<x ->*16"))
  .sound("sine")
  .rel(0.1)
  .dec(0.5);
