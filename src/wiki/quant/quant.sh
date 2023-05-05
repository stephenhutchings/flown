#bin/sh

# Run this script from the src/wiki/quant directory

# Generated a spritesheet of stretched flags with a transparent background.
# Use point resampling for later quantization

magick montage ../png/*.png -geometry 150x90! -filter Point -background transparent montage.png;

# Quantize the image to 16 and 24 colours in various colour spaces
# No dithering, no alpha

for N in 16 24; do \
  for S in RGB CMY sRGB \
           XYZ LAB LUV  \
           HSL HSB HWB  \
           YIQ YUV OHTA ; do \
    magick montage.png -alpha Deactivate -quantize $S +dither -colors $N \
          montage-$N-$S.png; \
  done; \
done


# List the colors in the quantized image
magick montage-24-sRGB.png -format %c -depth 8 histogram:info:-
magick montage-24-LUV.png -format %c -depth 8 histogram:info:-
