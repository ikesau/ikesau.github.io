setcpm(70);

$: stack(
  sound("bd:3 -").lpf(180).dist("2:.3"),
).bank("vintage")

$: sound("hh*4").bank("vintage").gain("<.1 .2>*2").dec(.4)

$: sound("bd").slow(2).bank("vintage").duck(2).duckatt(.2)

$: sound("<vintage_rd:3 vintage_rd:2!2>*6").gain("<.2 .1@2>*6".add(slider(0,-0.3,4,.1)))

$: sound("triangles:2*6").mask(irand(2).seg(6).rib(1,4)).pan(rand.range(0,1)).delay(.3).dt(1).gain(4)

let notes = irand(8).seg(8).rib(20,200)

$: note(notes)
  .struct("<x x@2 x@3>*3")
  .sound("sax_vib")
  .dec(3)
  .scale("F#:pentatonic, C#:major")
  .o(2)

$: note(notes.sub(10)).struct("<x@2>").sound("sine").scale("F#:pentatonic")
