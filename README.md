# Car Simulator

**Car Simulator** is a console-based application to emulate car movements on a grid with both manual and automated modes.

## Features

- Dynamic grid setup with user-defined dimensions.
- Manual mode allowing users to direct car movements with simple commands: `F` = Forward, `B` = Back, `L` = Left, `R` = Right, `Q` = Quit.
- Automated mode with predefined movements for a hands-off demonstration.
- Collision prevention: alerts users in manual mode if a move will cause a crash.
- Unit tests ensuring the integrity and functionality of the simulator.

## Installation

Clone the repo, navigate to the project directory and install dependencies:
```bash
git clone git@github.com:alialfredji/car-simulator.git
cd car-simulator
npm install
```

# Usage

### Manual Mode
Start the simulator with `npm start`. The user is prompted to provide the grid dimension (x,y), where x and y are positive integers with a maximum of 50 each. Subsequent prompts will request movement commands. In case of potential collisions, users will be alerted and can choose to either prevent the crash or allow it to occur.

### Automated Mode
Run `npm run start:auto` to observe the car's automated movements on the grid.

### Testing
Run unit tests using:
```bash
npm test
```

# Limitations
- The maximum grid size is 50x50.
- Car's dimension is fixed at 1x1.
- The car's initial position and direction are predefined as x=0, y=0, facing East.