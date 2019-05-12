var Jimp = require('jimp'),
	fs = require('fs'),
	chalk = require('chalk'),
	available_params = ['folder', 'perRow', 'amount', 'format'],
	args = require('cli.args')(['folder:', 'perRow:', 'amount:', 'format:']);

// set defaults
var config = {
	folder: "sprites",
	perRow: 5,
	amount: 10,
	format: "$s.png",
	dimensions: {
		height: 400,
		width: 400
	}
}

console.log("\n");
console.log(chalk.blue("==================== USED CONFIG ===================="));

for (let i = available_params.length - 1; i >= 0; i--) {
	// if argument was passed
	if (args[available_params[i]]) {
		config[available_params[i]] = args[available_params[i]];
	}
	console.log(chalk.green(available_params[i]) + " = " + chalk.cyan(config[available_params[i]]));
}

console.log(chalk.blue("==================== USED CONFIG ===================="));
console.log("\n");
config.HFrame = config.amount / config.perRow;

// Check if HFrame is a float
if (config.HFrame % 1 != 0) {
	config.HFrame = (config.HFrame).toFixed();
	console.log(chalk.red(`HFrame is a float (${config.amount / config.perRow}), rounding it to ${config.HFrame}`));
}

console.log(chalk.cyan(`We gonn be having an HFrame of ${config.HFrame}`));

// Read folder/1.png and get its dimensions
Jimp.read(getSpritePath(1), (err, first_image) => {
	if (err) {
		console.log(chalk.red("========================== ERROR ============================"));
		console.log(chalk.red(`Something wrong happened while opening ${config.folder}/1.png`));
		console.log(chalk.red(err));
		console.log(chalk.red("========================== ERROR ============================"));
	}

	// get dimensions
	console.log("Using dimensions: " + first_image.bitmap.width + "x" + first_image.bitmap.height + "\n");

	config.dimensions.height = first_image.bitmap.height;
	config.dimensions.width = first_image.bitmap.width;

	let output_width = config.dimensions.width * config.perRow;
	let output_height = config.dimensions.height * config.HFrame;

	new Jimp(output_width, output_height, async (err, output_image) => {
		let current_x = 0;
		let current_y = 0;
		let current_id = 1;

		for (let i = 0; i < config.HFrame; i++) {
			console.log("Working on row number " + i);

			for (let j = 0; j < config.perRow; j++) {
				let current_sprite = await Jimp.read(getSpritePath(current_id)).then(img => {
					return img;
				}).catch(err => {
					console.log(chalk.red("================= GOT AN EPIC ERROR OVA HERE ================="));
					console.log(chalk.red(err));
					// I can either return an empty image OR just act like we already composited one and increase offsets...
					return new Jimp(config.dimensions.width, config.dimensions.height, (err, placeholder) => {
						return placeholder;
					});
				});

				output_image.composite(current_sprite, parseInt(current_x), parseInt(current_y));
				console.log(chalk.green(`Just dropped a sprite at (${current_x}, ${current_y})`));

				current_x += config.dimensions.width;

				// break before we go beyond the amount we're allowed
				if (current_id >= config.amount) {
					break;
				}

				current_id++;
			}

			// break before we go beyond the amount we're allowed
			if (current_id > config.amount) {
				break;
			}

			current_x = 0;
			current_y += config.dimensions.height;
		}

		output_image.write(getSpritePath("output" + Date.now()));
	});

});

function getSpritePath(id) {
	let filename = config.format.replace("$s", id);
	return `sprites/${config.folder}/${filename}`;
}