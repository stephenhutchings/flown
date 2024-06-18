## Aspect Ratios

With few exceptions, flags are rectangular, but their sides occur in many
different ratios.

Purists may argue that the original intentions of the design should be upheld.
But there is a counterargument.

The proliferation of differing ratios presents interesting trivia, but the
differences are irrelevant when flags are used as visual affordances outside of
official contexts. Their use in emoji pickers provides a compelling example. In
such a use case, mismatched proportions could degrade the appearance of both
the individual flags and the surrounding layout, with many minor variations
appearing unintentional or irregular.

Designers identify these sort of inconsistencies as a distraction that should be
minimised. The layouts they create rely on repeatable blocks of consistently
sized shapes. With no standard shape to rely on, the temptation to crop or scale
flags in situ is inevitable. However, such an ad hoc approach would greatly
compromise the flags with the most extreme widths or heights.

<figure>
  <img width="768" height="484" alt="Official construction" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Flag_of_the_Comoros_%28construction_sheet%29.svg/2880px-Flag_of_the_Comoros_%28construction_sheet%29.svg.png">
  <figcaption>
    Scaling flags without deviating from their construction rules is an impossible task, as their official constructions often require specific ratios.
  </figcaption>
</figure>

Deciding on an aspect ratio is a difficult choice. The most commonly used ratio
is 3:2, of which there 109 flags in this library. However, 2:1 is also common,
numbering 81 flags. The gap between these two ratios is significant. When
narrower designs are adapted to a wider format, they appear stretched. The same
is true in the other direction — wider flags look uncomfortably squashed in the
narrower format. To compromise, an aspect ratio of 5:3 is used. While less
common than the first two, it offers a happy medium, distorting more flags but
to a much lesser degree.

Modifying the shapes of flags without introducing unnecessary distortions is a
substantial undertaking. With that in mind, changes have been made in a way that
aims to tread as lightly as possible. Each flag has been scaled using strategies
that cater to their specific design elements.

1. Horizontal, vertical and diagonal bands are stretched to fill the new
   dimensions.

2. Emblems and other items in the foreground maintain their proportions when
   scaled. For example, if the new flag design is 120% wider, the foreground
   elements are increased in both directions by 110%. This balances the change
   in distance to the vertical and horizontal edges.

3. Large items like squares and triangles are scaled in a way that best
   compromises between the competing relationships that inform them. For
   example, if an equilateral triangle points to the center on a narrow flag, it
   cannot be widened and keep equal sides. Instead, it is stretched to a lesser
   degree, keeping something of the equilateral triangle while still pointing
   near the centre of the flag.

<!-- 2. Squares and equilateral triangles have been generally been scaled in a way
   that maintains their proportions. In a similar way, items like crosses are
   scaled so that there vertical and horizontal thicknesses remain in sync. -->

[1]: https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags
