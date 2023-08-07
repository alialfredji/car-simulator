const Environment = require('./environment.class');

describe('Environment Class', () => {
	let env;

	beforeEach(() => {
		env = new Environment();
	});

	describe('setGridDimension()', () => {
		it('throws an error when no object is passed', () => {
			expect(() => env.setGridDimension()).toThrow('invalid dimension');
		});
	
		it('throws an error when the dimension object does not contain x and y properties', () => {
			expect(() => env.setGridDimension({})).toThrow('invalid dimension');
		});
	
		it('throws an error when the x or y values are not numbers', () => {
			expect(() => env.setGridDimension({x: 'a', y: 'b'})).toThrow('invalid dimension');
		});
	
		it('throws an error when the x or y values are negative', () => {
			expect(() => env.setGridDimension({x: -1, y: -1})).toThrow('invalid dimension');
		});
	
		it('throws an error when the x or y values are greater than 50', () => {
			expect(() => env.setGridDimension({x: 51, y: 51})).toThrow('invalid dimension');
		});
	
		it('does not throw an error for valid dimensions', () => {
			expect(() => env.setGridDimension({x: 10, y: 10})).not.toThrow();
		});
	
		it('updates the grid for valid dimensions', () => {
			env.setGridDimension({x: 10, y: 10});
			expect(env.dimension.x).toBe(10);
			expect(env.dimension.y).toBe(10);
		});
	});

	describe('setCarPosition()', () => {
		it('should set the car position correctly', () => {
			env.setCarPosition({ x: 0, y: 0, direction: 'E' });
			expect(env.carPosition).toEqual({
				x: 0,
				y: 0,
				direction: 'E',
				directionIcon: '➡️ ',
			});
		});

		it('should not set car position if invalid', () => {
			env.setCarPosition({ x: 'a', y: 0, direction: 'E' });
			expect(env.carPosition).toEqual({
				x: 0,
				y: 0,
				direction: 'E',
				directionIcon: '➡️ ',
			});
		});
	});

	describe('setCarDirectionIcon', () => {
		it('should set correct car direction icon', () => {
			env.setCarDirectionIcon('N');
			expect(env.carPosition.directionIcon).toBe('⬆️ ');
		
			env.setCarDirectionIcon('E');
			expect(env.carPosition.directionIcon).toBe('➡️ ');
		
			env.setCarDirectionIcon('S');
			expect(env.carPosition.directionIcon).toBe('⬇️ ');
		
			env.setCarDirectionIcon('W');
			expect(env.carPosition.directionIcon).toBe('⬅️ ');
		});
	});

	describe('carWillCrash()', () => {
		it('should return true if car will crash', () => {
			env.setGridDimension({x: 3, y: 3});
			expect(env.carWillCrash(4, 1)).toBeTruthy();
		});

		it('should return false if car will not crash', () => {
			env.setGridDimension({x: 3, y: 3});
			expect(env.carWillCrash(2, 1)).toBeFalsy();
		});
	});

	describe('getExpectedCarPosition()', () => {
		it('should return correct new position for given command', () => {
			const newPosition = env.getExpectedCarPosition('F');
			expect(newPosition.isChanged).toBeTruthy();
			expect(newPosition.position.x).toEqual(1);
		});

		it('should return unchanged position for invalid command', () => {
			const newPosition = env.getExpectedCarPosition('Z');
			expect(newPosition.isChanged).toBeFalsy();
			expect(newPosition.position.x).toEqual(0);
		});
	});

	describe('printGrid()', () => {
		it('should print grid correctly', () => {
			const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});
			env.printGrid();
			expect(logMock).toHaveBeenCalled();
			logMock.mockRestore();
		});
	});
});
