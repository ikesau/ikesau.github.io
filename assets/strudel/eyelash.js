samples('github:switchangel/breaks');
samples('http://localhost:5432');

setcpm(160 / 4);

const beat = "<1 0 0 1 0 1 0 0>*16";

// $: sound("breaks/2").fit().scrub(irand(16).div(16).seg(16).rib(2,1)).o(2).hpf(2000).gain(slider(1,0,2,.1))

$: sound("bd").dist(2).o(2);
$: sound("bd").struct(beat).lpf(200).dist(2).o(2);

$: sound("- sd").gain(2).speed(2.2).o(2);
// $: sound("- [sd [[sd sd sd] | ~ ] ]").gain(1.5).speed(2.2)
// $: sound("sd*16").bank("vintage").mask(irand(2).seg(16).rib(0,4)).gain(.3)

// $: sound("hh*16").gain("<.3 .5>*16").dec(.04).hpf(perlin.range(1000,4000))

// $: sound("<- hh hh hh>*16").dec(.1).gain("<.3 .7 .3>*16")

// $: sound("ocean:8")
//   .freq("<65 76>/2")
//   .struct(beat)
//   .begin(rand.segment(1).slow(2))
//    // .begin(rand.seg(8).rib(4,2))
//   .dec(3/8)
//   .room(.5)

// $: sound("saw").note("<[C4, D5] [C3, F5, A5]>/2").att(1).vib(4).vibmod(.2).release(2).gain(.5)

// $: sound("tri").duck(2).duckatt(10).duckdepth(1).gain(0).duckons(0).sus(10)
