const Environment = require('./environment.class');

// Initialize the Environment class to manage the simulation's grid and car.
const environment = new Environment();

/**
 * Generates a randomized command for the car and processes it.
 * The command could either be to move the car forward (F), backward (B), 
 * turn the car left (L), or right (R).
 * If the expected movement would cause a crash, the function will re-randomize.
 */
const randomizeCommand = () => {
	const commands = [ 'F', 'F', 'F', 'F', 'B', 'B', 'B', 'B', 'L', 'L', 'R', 'R' ];

	// Randomly select a command from the available options.
	const command = commands[Math.floor(Math.random() * commands.length)];

	// Get the expected position of the car after processing the command.
	const { isChanged, position } = environment.getExpectedCarPosition(command);
	if (!isChanged) {
		simulate();
		return;
	}

	// Check if the car's expected movement will result in a crash.
	if (environment.carWillCrash(position.x, position.y)) {
		simulate();
		return;
	}

	// If there's no crash, set the car's position to the new expected position.
	environment.setCarPosition(position);
	simulate();
};

/**
 * Main function for the simulation.
 * Displays the grid, showing the car's current position, 
 * and then randomizes the next move for the car.
 */
const simulate = () => {
	environment.printGrid();
	// Wait for 225 milliseconds and then randomize the next command for the car.
	setTimeout(() => randomizeCommand(), 225);
};

/**
 * Initialization function: Starts the simulation by asking the user to provide 
 * the dimensions for the room (or grid) in which the car will move.
 */
const init = () => {
	const randomDimension = Math.floor(Math.random() * 50) + 1;

	environment.setGridDimension({
		x: randomDimension,
		y: randomDimension,
	});
	simulate();
};

// Begin the simulation.
init();
