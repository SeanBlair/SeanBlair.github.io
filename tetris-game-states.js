// For defining all the generic actions that all states support.
class GenericState {
  constructor(executeFunction) {
    this.execute = executeFunction;
  }
  initialize(target) {
    this.target = target;
  }
  initiate() {
    this.target.changeState(this.target.states.initiating);
  }
  start() {
    this.target.changeState(this.target.states.starting);    
  }
  pause() {
    this.target.changeState(this.target.states.pausing);
  }
  drop() {
    this.target.changeState(this.target.states.dropping);    
  }
  moveLeft() {
    this.target.changeState(this.target.states.movingLeft);
  }
  moveRight() {
    this.target.changeState(this.target.states.movingRight);
  }
  moveDown() {
    this.target.changeState(this.target.states.movingDown);
  }
  rotateClockWise() {
    this.target.changeState(this.target.states.rotatingClockWise);
  }
  rotateCounterClock() {
    this.target.changeState(this.target.states.rotatingCounterClock);
  }
  speedUp() {
    this.target.changeState(this.target.states.speedingUp);
  }
}

//===================================== Concrete State Classes.================
// These all set their own execute() function and shadow their own action.
export class Initiating extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
  }
}
export class Starting extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
  }
}
export class Pausing extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
  }
}
export class Dropping extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
    this.drop = executeFunction;
  }
}
export class MovingLeft extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
    this.moveLeft = executeFunction;
  }
}
export class MovingRight extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
    this.moveRight = executeFunction;
  }
}
export class MovingDown extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
    this.moveDown = executeFunction;
  }
}
export class RotatingClockWise extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
    this.rotateClockWise = executeFunction;
  }
}
export class RotatingCounterClock extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
    this.rotateCounterClock = executeFunction;
  }
}
export class SpeedingUp extends GenericState {
  constructor(executeFunction) {
    super(executeFunction);
  }
}