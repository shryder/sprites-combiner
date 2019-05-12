# sprites-combiner
NodeJS script to combine multiple sprites files into a single file

# Usage
`$ node app.js --folder "walking_anims" --perRow 5 --amount 15 --format "Walk ($s).png"`


You're expected to have a folder inside the `sprites` folder that has a list of sprites. All sprites are expected to be named $s.png (e.g. 1.png, 2.png, 3.png). However, that can be changed by setting the `--format` parameter, $s is placeholder of the sprite's ID.

# Parameters
`--folder`: Name of a folder inside the `sprites` folder, defaults to "walking_anims".

`--perRow`: Amount of sprites per row, defaults to 5.

`--amount`: Amount of sprites that you want to combine together, defaults to 10. Note: if a certain sprite was not found, it will be replaced by empty space.

`--format`: File naming format that your sprites use, defaults to `$s.png`. $s is replaced with a number automatically.


# Example
There is a sample `walking_anims` folder that has some walking animations. To test it, just run:

`$ node app.js --folder "walking_anims" --perRow 5 --amount 15 --format "Walk ($s).png"`
