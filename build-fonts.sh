#!/bin/sh

FONT=TerminusTTF-4.46.0.ttf

generate_font ()
{
    SIZE=$1
    CHARS=$2

    DIR=resources/Terminus_${SIZE}
    mkdir -p ${DIR}

    for CHAR in ${CHARS}
    do
        CODE=$(printf '%d' "'${CHAR}'")
        convert -font ${FONT} -pointsize ${SIZE} label:${CHAR} -filter point -resize 200% -negate ${DIR}/${CODE}.png
        convert ${DIR}/${CODE}.png scanlines.png -composite ${DIR}/${CODE}.png
    done
}


generate_font 12 "% - 0 1 2 3 4 5 6 7 8 9"
generate_font 14 ", - 0 1 2 3 4 5 6 7 8 9 A C D F J M N O P S T W a b c d e g h i k l n o p r t u v y » ♥"



