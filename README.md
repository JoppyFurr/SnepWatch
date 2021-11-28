# SnepWatch
A digital clock-face using the Terminus font.

![Screenshot](screenshots/Screenshot%202021-11-28%20at%2012.25.42.png)

## Features

Why have September when you can have Sneptember?

Features:
 * Battery percentage
 * Date: Eg. "Sun 28 Nov", "Wed 15 Snep"
 * Configurable fill and outline colour for time
 * Step counter
 * Heart rate + colour-coded zone
   * Blue for Fat-burn
   * Gold for "Cardio"
   * White for "Peak"
   * Zone hidden when heart rate is below fat-burn.

## Building
Before running the usual Fitbit build process, the font images need to be generated:
```
./build-fonts.sh
```

Once this is done, the usual build mechanism can be used:
```
nxp fitbit
build
install
```
