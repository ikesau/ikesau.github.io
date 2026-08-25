/**
 * category: song-snippet
 */
$: sound("bd:3*6").bank("vintage").gain(1.2)
$: sound("rim*12").bank("vintage").swingBy(1/5,12).ply(2).gain(.5).dec(.1).hpf(4000)
$: sound("triangles * 4").echo(4, 1/6, 3).n(20)
$: sound("breaks/2").fit()
    .slice(12, irand(12)
           .segment(12).rib(2,2)).gain(.8).dec(1/3).dist("1:.5").distorttype("diode")

$: note("C1").gain(10)
$: note("C2,G4").struct(
  chooseCycles(
    "x - x - x x",
    "- x x - x x" 
  )
).fast(2).sound("square").decay(.2).gain(1.5).lpf(100)