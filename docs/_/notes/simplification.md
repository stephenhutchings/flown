## Simplification

Many flags use basic geometric constructions, but not all. For example, Belize,
Bolivia, and Brunei feature complex illustrations and typography in their
designs. Much of this detail is unnecessary when flags are displayed at small
sizes. Moreover, the most complex of these designs take up hundreds of
kilobytes, negating the advantages of the vector format.

All flags are drawn on a 1200&times;720 unit grid. The large size of the grid
allows pre-rounding to whole units without visually compromising each design.
Snapping values in this way removes the risk of later minification steps
introducing unwanted distortions. This grid determines the finest level of
detail that is possible, so simplification remains consistent across the
collection. However, an exception is made for typography, which is allowed an
additional decimal place of accuracy to avoid exaggerated distortions.

Shapes are drawn with only a `<path>`, `<circle>` and `<use>` elements, and
colour is exclusively applied with the `fill` attribute. No `stroke` or
`gradient` is applied to any of the artwork. This constraint should make the
collection more amenable to further processing by others, as there are less
corner cases to consider.

Land masses are drawn using only straight lines, so that there shapes can be
simplified using the [Ramer–Douglas–Peucker] algorithm.

Finally, each design has been simplified to fit within a maximum file size of
10kB. The means the most detailed flags feature the highest level of simplification.

[Ramer–Douglas–Peucker]: https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
