# Colours

Despite their tendency towards primary colours, flags exhibit a large degree of subtle, and often unintentional, variation. While some flags dictate the use of specific colours, others are less precise.

<figure>
  <img width="500" height="200" alt="All flag colours" src="/assets/img/palette/all.svg">
  <figcaption>
    The colour palette used by all the original flags includes over a thousand distinct varieties. This profusion tends to fall into broadly similar tones and hues.
  </figcaption>
</figure>

Limiting the colour palette means the flags in this collection deviate from
their official designs. However, it ensures that when flags are shown together,
the different combinations are predictable and unlikely to clash. The small,
predefined palette also sets the groundwork for more creative
modifications.

Choosing the best approach to align these colours requires some thinking. An
overly minimal approach would force unnecessary substitutions, significantly
altering the original designs. It's also important that the colour palette is
defined by the needs of the flags, and not the other way around.

To construct an initial palette, the full color selection was quantized down to
colour sets of varying quantities. From this process, a basic palette of 16
colors was selected. This set was able to reproduce most flags with reasonable accuracy, while minimising duplication.

<figure class="fx fxc gap">
  <img width="160" height="10" alt="Quantized palette" src="/assets/img/palette/16.svg">
  <img width="200" height="10" alt="Quantized palette" src="/assets/img/palette/20.svg">
  <img width="240" height="10" alt="Quantized palette" src="/assets/img/palette/24.svg">
  <img width="320" height="10" alt="Quantized palette" src="/assets/img/palette/32.svg">
  <figcaption>
    The full set quantized down to a selection of 16, 20, 24 and 32 colours.
  </figcaption>
</figure>

But this mechanical selection wasn't perfect. The process treats all
colours equally, regardless of the area they cover. Rarer colours --- like
the turqoise variations used by the Bahamas and Uzbekistan, or the Qatari maroon
--- were lost in the averages. Other detailed elements were too
complex to resolve without additional shades. To resolve these issues, the
palette was expanded to 32 colours. New colours were added manually
to fill the gaps according to the flags that were most affected.

To prevent introducing too much bias, the palette is mapped to the original flags by computing the [CIEDE2000] colour difference in L\*a\*b\* color space. This ensures consistent mapping of colours and helps to identify issues. When an unexpected color is used, it suggests a weakness in the palette.

Before computing the difference, the b-channel of the Lab colour value is
downweighted and the L-channel is upweighted. The first weighting helps to
emphasise cultural distinctions in primary colours over perceptual differences.
For example, as red moves towards orange, it is more likely to be perceived as a
different primary color compared to an equivalent move towards violet. The
second weighting prioritised tonal similarity over exact hue matching. Note that
this weighting was not chosen scientifically, and may reflect the author's
biases.

Finally, the palette was manually refined to better align the levels of
saturation and brightness of the palette. Again, this reflects the author's
personal taste.

<figure>
  <img width="320" height="10" alt="Final colour palette" src="/assets/img/palette/custom-32.svg">
  <figcaption>
    Choosing the final palette has been equal parts art and science.
  </figcaption>
</figure>

It's worth noting that the palette does not include pure white or black. This was originally a result of the colour quantisation, but has its own benefits. The outlines of flags that use large fields of white, such as the Japanese flag, remain defined on pages using a pure white background.

[CIEDE2000]: https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
