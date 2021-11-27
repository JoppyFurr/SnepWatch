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

generate_digits ()
{
    SIZE=$1
    CHARS=$2

    DIR=resources/Digits_Fill
    mkdir -p ${DIR}

    for CHAR in ${CHARS}
    do
        CODE=$(printf '%d' "'${CHAR}'")
        convert -font ${FONT} -pointsize ${SIZE} label:${CHAR} -filter point -resize 800% -negate ${DIR}/${CODE}.png
        convert ${DIR}/${CODE}.png scanlines.png -composite ${DIR}/${CODE}.png
    done

    DIR=resources/Digits_Outline
    mkdir -p ${DIR}

    # Composition:
    # Union of with 2px offset in each up, down, left, right
    # difference with original
    # apply scanlines

    for CHAR in ${CHARS}
    do
        CODE=$(printf '%d' "'${CHAR}'")
        convert -font ${FONT} -pointsize ${SIZE} -background transparent label:${CHAR} -filter point -resize 800% -negate ${DIR}/${CODE}.png
        cp ${DIR}/${CODE}.png ${DIR}/${CODE}_base.png
        convert -gravity center ${DIR}/${CODE}.png ${DIR}/${CODE}_base.png -geometry +1+0 -composite ${DIR}/${CODE}.png
        convert -gravity center ${DIR}/${CODE}.png ${DIR}/${CODE}_base.png -geometry -1+0 -composite ${DIR}/${CODE}.png
        convert -gravity center ${DIR}/${CODE}.png ${DIR}/${CODE}_base.png -geometry +0+1 -composite ${DIR}/${CODE}.png
        convert -gravity center ${DIR}/${CODE}.png ${DIR}/${CODE}_base.png -geometry +0-1 -composite ${DIR}/${CODE}.png
        convert ${DIR}/${CODE}.png ${DIR}/${CODE}_base.png -compose Xor -composite ${DIR}/${CODE}.png
        # convert ${DIR}/${CODE}.png scanlines.png ${DIR}/${CODE}.png -composite ${DIR}/${CODE}.png
        rm ${DIR}/${CODE}_base.png
    done

}

generate_font 12 "% - 0 1 2 3 4 5 6 7 8 9"
generate_font 14 ", - 0 1 2 3 4 5 6 7 8 9 A C D F J M N O P S T W a b c d e g h i k l n o p r t u v y » ♥"
generate_digits 14 "0 1 2 3 4 5 6 7 8 9 :"



