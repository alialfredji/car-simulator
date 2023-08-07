const readline = require('readline');
const Environment = require('./environment.class');

// Create a readline interface for reading from and writing to the standard I/O streams.
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Initialize the Environment class to manage the simulation's grid and car.
const environment = new Environment();

const printLastCarPosition = () => {
	console.log('\n');
	console.log([
		'Last Car Position:',
		`   x - ${environment.carPosition.x}`,
		`   y - ${environment.carPosition.y}`,
		`   direction - ${environment.carPosition.direction}`,
		`	directionIcon - ${environment.carPosition.directionIcon}`,
	].join('\n'));
};

/**
 * Processes a single command and executes the corresponding action.
 *
 * @param {string} command - A string representing the action to be executed.
 * @returns {boolean} - Indicates whether the simulation should proceed to the next command.
 */
const processCommand = (command) => {
	// Check if the input command is to quit the simulation.
	if ([ 'q', 'Q' ].indexOf(command.trim()) !== -1) {
		console.log('Exiting simulation...');
		printLastCarPosition();
		process.exit(0);
		return false;
	}

	// Check if the input command is valid.
	if ([ 'f', 'b', 'l', 'r' ].indexOf(command.trim().toLowerCase()) === -1) {
		console.log('Invalid command. Please enter a valid command.');
		return false;
	}

	// Calculate the expected position of the car after executing the command.
	const { isChanged, position } = environment.getExpectedCarPosition(command);

	// if the car's position is unchanged, then the command is invalid.
	if (!isChanged) return true;

	// Check if the car will crash based on the expected position.
	if (environment.carWillCrash(position.x, position.y)) {
		rl.question('Car is about to crash! Continue? (yes/no): ', (response) => {
			if ([ 'y', 'yes' ].indexOf(response.trim().toLowerCase()) !== -1) {
				console.log('Unsuccessful! Car crashed.');
				printLastCarPosition();
				process.exit(1);
			} else {
				getCommands();
			}
		});
		return false;
	}

	// Update the car's position to the expected position.
	environment.setCarPosition(position);
	return true;
};

/**
 * Simulate the series of commands in sequence.
 *
 * @param {Array<string>} commands - An array of commands to be executed.
 */
const simulate = async (commands) => {
	for (const command of commands) {
		const shouldProceed = processCommand(command);
		if (!shouldProceed) break;

		environment.printGrid();
		await new Promise(resolve => setTimeout(resolve, 125));
	}

	getCommands();
};

/**
 * Prompt the user for a list of commands and then execute the simulation based on those commands.
 */
const getCommands = () => {
	const question = [
		'F - Move car forward',
		'B - Move car backward',
		'L - Turn car left',
		'R - Turn car right',
		'Q - Quit simulation',
		'\nEnter list of commands separated by commas (F, B, L, R, Q): ',
	].join('\n');

	rl.question(`\n${question}`, (input) => {
		const parsedCommands = input.split(',').map(cmd => cmd.trim().toUpperCase());
		simulate(parsedCommands);
	});
};

/**
 * Initialization function: Starts the simulation by asking for grid dimensions.
 */
const init = () => {
	rl.question('Enter room dimension (x,y), comma separated. Max dimension is 50,50: ', (input) => {
		// Check for valid input.
		const inputList = input.trim().split(',');
		if (inputList.length !== 2) {
			console.log('Invalid input. Please enter two comma-separated integers.');
			init();
			return;
		}

		// Parse the input into an object with x and y properties.
		const dimension = inputList.reduce((acc, curr, idx) => ({
			...acc,
			[idx === 0 ? 'x' : 'y']: parseInt(curr),
		}), {});

		// Check for valid grid dimension input.
		if (Object.keys(dimension).some(key => isNaN(dimension[key]) || dimension[key] < 1 || dimension[key] > 50)) {
			console.log('Invalid input. Please enter positive integers between 1 and 50.');
			init();
		} else {
			environment.setGridDimension(dimension);
			getCommands();
		}
	});
};

// Begin the simulation.
init();