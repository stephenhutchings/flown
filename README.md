# flown

!!! This is a work in progress

Weak spots

- Kazakhstan - aqua is too light
- Bahamas - turquoise is too dark
- Uzbekistan - should be "azure"
- Bright red is too bright

Simplified iconic representation of country flags, modified to use a consistent
colour palette and aspect ratio.

## Motivation

Graphic designers are often required to source images for national flags. This
task raises inevitable questions.

### Where should I source my images?

Wikipedia, or more specifically Wikimedia, provides one option. This can be
time-consuming, searching for and downloading 250 images. The images are
generally well-made, but this isn't true for every image.

Alternatively, searching the web produces a myriad of possibilities. However,
the quality can be unreliable, with unexplained deviations introduced at the
whim of another designer.

### Should I standardise the colour palette?

Despite their tendency towards primary colours, flags exhibit a large degree of
subtle, and often unintentional, variation. Choosing the best approach to align
these colours requires thinking and manual effort to implement.

### Should I standardise the shapes?

Designers often see inconsistencies as a distraction that should be minimised.
Moreover, layouts often rely on repeatable blocks of consistently sized shapes.
Here again, flags work against the designer. With few exceptions, flags are
rectangular, but the proportion of their sides occur in many different
proportions. Standardising these shapes without introducing distortions is
another substantial undertaking. Consider Timor-Leste as an example. If you
alter the dimensions of the flag, does the star still point to the top-left
corner of the flag as is intended.

## Simplification

Many flags use basic geometrical constructions, but not all. For example,
Belize, Bolivia, and Brunei feature complex illustrations and typography in
their designs. This information is unnecessary when flags are displayed at small
sizes, and has been removed or reduced for the smaller icon set.

## Palette

Country flags use a wide array of colours. However, most tend towards a basic
set of primaries, despite their wide deviations. Choosing the final palette has
been equal parts art and science.

An initial palette was chosen by reducing the full color selection down to a
quantized set of colours of varying quantities. From this process, an initial palette of
16 colors was selected. This number of colours was able to reproduce most flags
with reasonable accuracy, while minimising duplication in the palette.

Despite the flexibility of this palette, the mechanical selection had some
weaknesses. Rarer colours -- like the turqoise variations used by the Bahamas
and Uzbekistan, or the Qatari maroon -- were missing, and substitution would
significantly alter the original design. Other flags included illustrations that
were too complex to resolve without a few additions. To resolve these issues,
the palette was expanded to 24 colours. New colours were added manually to fill
the gaps according to the flags that were most affected.

To prevent the introduction of too much bias, the palette is mapped to the
original flags by computing the CIEDE2000[2] colour difference in Lab color
space. This ensures consistent mapping of colours and helps to identify issues.
When an unexpected color is used, it suggests a weakness in the palette.

Before computing the difference, the b-channel of the Lab colour value is
downweighted. This weighting helps to emphasisise cultural distinctions in
primary colours over perceptual differences. For example, as red moves towards
orange, it is more likely to be perceived as a different primary color compared
to an equivalent move towards violet. Note that this weighting was not chosen
scientifically, and may reflect the author's biases.

Finally, the palette was manually refined to better align the levels of saturation and
brightness of the palette. Again, this reflects the author's personal taste.

It's worth noting that the palette does not include pure white or black. This
was originally a result of the colour quantisation, but has its own benefits.
The outlines of flags that use large fields of white, such as the Japanese flag,
remain defined on pages using a pure white background.

## Ratios

According to Wikipedia[1], the most commonly used aspect ratio is 3:2. This is
also the median value. The mean proportion is just a little greater than 5:3
(~1.6786). As most designs are easier to scale outwards rather than inwards,
the larger of these three proportions is used.

Scaling flags without deviating from their construction rules is an impossible
task, as their official constructions often require specific ratios. With that
in mind, scaling has been done here in a way that aims to tread as lightly as
possible. How each flag has been scaled has depended on the nature of the
design, but can be broadly categorized as follows.

| Type                   | Example        | Scaling process                        |
| ---------------------- | -------------- | -------------------------------------- |
| Evenly divided         | France         | Stretched                              |
| Radial symmetry        | United Kingdom | Stretched, with scaled internal ratios |
| Horizontal symmetry    | Denmark        | Extended outwards                      |
| Horizontal, asymmetric | Cuba           | Scaled and cropped                     |

For pixel-aligned edges at small sizes, aim for one of these options.

| Width | Height |
| ----- | ------ |
| 20px  | 12px   |
| 25px  | 15px   |
| 30px  | 18px   |
| 35px  | 21px   |

[1]: https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags
[2]: https://en.wikipedia.org/wiki/Color_difference#CIEDE2000
[3]: https://github.com/hampusborgos/country-flags
