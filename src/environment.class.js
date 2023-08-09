module.exports = class Environment {
	constructor () {
		this.minDimensionValue = 0;
		this.maxDimensionValue = 50;

		// Declare a variable to hold the room's dimension.
		this.dimension = {
			x: 0,
			y: 0,
		};
		this.grid = [];

		// Initial car position and direction (E is East).
		this.carPosition = {
			x: 0,
			y: 0,
			direction: 'E',
			directionIcon: '➡️ ',
		};
	}

	// Methods can be added here, for example, to set the room dimension:
	setGridDimension (dimension) {
		if (
			typeof dimension !== 'object'
			|| typeof dimension.x !== 'number'
			|| typeof dimension.y !== 'number'
			|| dimension.x < this.minDimensionValue
			|| dimension.y < this.minDimensionValue
			|| dimension.x > this.maxDimensionValue
			|| dimension.y > this.maxDimensionValue
		) {
			throw new Error('invalid dimension');
		}

		this.dimension = dimension;
		this.grid = Array(dimension.y).fill().map(() => Array(dimension.x).fill());
	}

	// Method to print out grid on the console
	printGrid () {
		// Clear the console to keep grid always at the same position
		console.clear();

		// Build the top border of the room
		const topBorder = '+' + '-'.repeat(this.dimension.x * 2) + '+';

		// Precompute the bottom border of the room
		const bottomBorder = topBorder;

		// Build the entire grid as a single string
		const gridStr = this.grid.map((row, rowIdx) => {
			let rowStr = '|';
			row.forEach((column, columnIdx) => {
				// Print the car's direction icon if the current column matches car's position
				if (columnIdx === this.carPosition.x && rowIdx === this.carPosition.y) {
					rowStr += this.carPosition.directionIcon;
				} else {
					// Empty space if the column doesn't have the car
					rowStr += '  ';
				}
			});

			return rowStr + '|';
		}).join('\n');

		// Print entire grid
		console.log(topBorder);
		console.log(gridStr);
		console.log(bottomBorder);
	}

	setCarDirectionIcon (direction) {
		switch (direction) {
		case 'N':
			this.carPosition.directionIcon = '⬆️ ';
			break;
		case 'E':
			this.carPosition.directionIcon = '➡️ ';
			break;
		case 'S':
			this.carPosition.directionIcon = '⬇️ ';
			break;
		case 'W':
			this.carPosition.directionIcon = '⬅️ ';
			break;
		}
	}

	// Method to set the car's position and direction:
	setCarPosition ({ x, y, direction }) {
		if (typeof x !== 'number') return;
		if (typeof y !== 'number') return;
		if (typeof direction !== 'string') return;
		if (x < 0 || x >= this.dimension.x) return;
		if (y < 0 || y >= this.dimension.y) return;
		if (![ 'N', 'E', 'S', 'W' ].includes(direction)) return;

		this.carPosition.x = x;
		this.carPosition.y = y;
		this.carPosition.direction = direction;
		this.setCarDirectionIcon(direction);
	}

	carWillCrash (newX, newY) {
		return newX < 0 || newX >= this.dimension.x || newY < 0 || newY >= this.dimension.y;
	}

	getExpectedCarPosition (command) {
		// Creating a temporary position to verify move validity
		const newPosition = Object.assign({}, this.carPosition);

		// Switch case to handle different commands and modify the temporary position
		switch (command.toUpperCase()) {
		case 'F':
		case 'f':
			switch (newPosition.direction) {
			case 'N': newPosition.y -= 1; break;
			case 'E': newPosition.x += 1; break;
			case 'S': newPosition.y += 1; break;
			case 'W': newPosition.x -= 1; break;
			}
			break;
		case 'B':
		case 'b':
			switch (newPosition.direction) {
			case 'N': newPosition.y += 1; break;
			case 'E': newPosition.x -= 1; break;
			case 'S': newPosition.y -= 1; break;
			case 'W': newPosition.x += 1; break;
			}
			break;
		case 'L':
		case 'l':
			switch (newPosition.direction) {
			case 'N': newPosition.direction = 'W'; break;
			case 'E': newPosition.direction = 'N'; break;
			case 'S': newPosition.direction = 'E'; break;
			case 'W': newPosition.direction = 'S'; break;
			}
			break;
		case 'R':
		case 'r':
			switch (newPosition.direction) {
			case 'N': newPosition.direction = 'E'; break;
			case 'E': newPosition.direction = 'S'; break;
			case 'S': newPosition.direction = 'W'; break;
			case 'W': newPosition.direction = 'N'; break;
			}
			break;
		default:
			return {
				isChanged: false,
				position: this.carPosition,
			};
		}

		return {
			isChanged: true,
			position: newPosition,
		};
	}
};
