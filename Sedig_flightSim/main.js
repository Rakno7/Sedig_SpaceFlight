//image data
let asteroid_img_src = "Asteroid.png"
let asteroid_explode_img_src = "Asteroid Destroyed.png"
let asteroid_damage_img_src = "Asteroid Damage.png"
let Ship_img_src = "Space ship.png"
var ScoreNum = 0;
var LiveNum = 9;
//no longer using the scrolling backround. instead I create stars from a class and transform their positions.
const ScrollingBackround = document.getElementById("StarsBackround")
//the score is measured by distance traveled, which at the moment only depends on speed.
const Scorecount = document.getElementById("Score")
//how many times the ship can be hit before the game resets
const Lifecount = document.getElementById("Lives")
//I shipspeed changes based on ship rotation, and is used for moving the ship left and right within a limited range.
var ShipSpeedX = 0;
//current speed of the Ship
var flightSpeed = 0;
//sound to play on loop. Volume is increased/decreased depending on flightspeed.
var ShipLowSpeed = new Audio('ShipLowSpeed.mp3')
ShipLowSpeed.loop = true
//sound to play while accelerating, volume starts at 0 and increases the longer the forward key is held.
var ShipAccelerate = new Audio('ShipAccelerate.mp3')
ShipAccelerate.loop = true
var shipVolume = 0.1
var AccelerateVolume = 0
//allows me to delay certain things from happening before the user has interacted with the window.
var gameStarted = false;

//waves will be set true and false based on score. different logic will play out depending on which wave number is active. 
let Wave1 = false
let Wave2 = false
let Wave3 = false
let Wave4 = false
let Wave5 = false
let Wave6 = false
let Wave7 = false
let Wave8 = false
let Wave9 = false
let Wave10 = false
let Wave11 = false
let Wave12 = false




//KEY PRESS DATA
var IS_LEFT_PRESSED = false;
var IS_RIGHT_PRESSED = false;
var IS_UP_PRESSED = false;
var IS_DOWN_PRESSED = false;
var IS_SHOOT_PRESSED = false
let last_keydown = 0
// Delay for shot
var canShoot = true
let ShotDelay = 0
//Rotation variables
let master_rotation = 0
let Backround_rotation = 0
let current_X = 900

// used to spawn Particles on an intrival when accelerating
let SpawnTimer = 0





//Rotates the image of the scrolling backround
////no longer using the scrolling backround. instead create stars from a class and transform their positions.
//   function turnBackround()
//   {
//     
//     ScrollingBackround.style.transformOrigin = 'center'
//     ScrollingBackround.style.transform = 'rotate(' + -master_rotation / 5 + 'deg)'
//     
//   }


// Rotate the ship left
function rotateLeft() {
  //master rotation has a range of 90 and -90. When looking up master rotation is 0
  if (master_rotation >= -89) {
    //Using a smaller variable in the place of flightspeed
    var flightspeedDec = flightSpeed / 10

    //rotation speed is effected by speed
    master_rotation = master_rotation - 1 + flightspeedDec
    //for debugging
    //Rotation_element.textContent = 'Rotation =' + ' ' + master_rotation

    //rotate around the center of the starships element 
    starShip.element.style.transformOrigin = 'center'
    //apply master rotation to the rotation of the starship element
    starShip.element.style.transform = 'rotate(' + master_rotation + 'deg)'
  }

}
// Rotate the ship right
function rotateRight() {
  if (master_rotation <= 89) {
    //Using a smaller variable in the place of flightspeed
    var flightspeedDec = flightSpeed / 10
    //rotation speed is effected by speed
    master_rotation = master_rotation + 1 - flightspeedDec
    //for debugging
    //Rotation_element.textContent = 'Rotation =' + ' ' + master_rotation

    //rotate around the center of the starships element 
    starShip.element.style.transformOrigin = 'center'
    //apply master rotation to the rotation of the starship element
    starShip.element.style.transform = 'rotate(' + master_rotation + 'deg)'
  }
}
//move the ship position
function moveLeft() {
  //current_X is the normal position of the ship
  //shipspeedX is used to give the ship slight offset depending on the rotation direction + speed. 
  current_X = current_X + ShipSpeedX
  //set the position
  starShip.element.style.position = 'relative'
  starShip.element.style.left = current_X + 'px'
}
//move the ship position
function moveRight() {
  //current_X is the normal position of the ship
  //shipspeedX is used to give the ship slight offset depending on the rotation direction + speed. 
  current_X = current_X + ShipSpeedX
  //set the position
  starShip.element.style.position = 'relative'
  starShip.element.style.left = current_X + 'px'
}
//Which Keys are being pressed?
function checkInput() {
  //when you press the key for shooting
  if (IS_SHOOT_PRESSED == true) {
    //this will have to change later shooting is still experimental, and I need to work it out.
    ShotDelay += 0.01
    if (ShotDelay > 2) {
      num_Projectiles += 1
      projectiles.push(new Projectile())

      ShotDelay = 0
    }
  }
  if (IS_LEFT_PRESSED) {
    rotateLeft();
  }
  if (IS_RIGHT_PRESSED) {
    rotateRight();
  }
  if (!IS_UP_PRESSED) {
    //decreases the acceleration sounds volume when not accelerating
    if (AccelerateVolume >= 0.01) {
      AccelerateVolume -= 0.01
      ShipAccelerate.volume = AccelerateVolume
    }
  }
  if (IS_UP_PRESSED == true) {
    SpawnTimer += 0.2
    if (SpawnTimer > 2) {
      starShip.SpawnParticle()
      SpawnTimer = 0
    }
    // While going less then the max speed
    if (flightSpeed < 5) {
      //increase the speed each tic
      flightSpeed += 0.01;
      if (flightSpeed > 1.5)

        //when ship volume is less then max
        if (shipVolume < 0.9) {
          //Increases the ship sounds volume when accelerating
          shipVolume += 0.01
        }
      //when ship volume is less then max
      if (AccelerateVolume < 0.9) {
        //Increases the ship sounds volume when accelerating
        AccelerateVolume += 0.0005;
      }
      //set the volume
      ShipLowSpeed.volume = shipVolume
      ShipAccelerate.volume = AccelerateVolume

      //increase the ships position on the y based on flightspeed.
      //So the ship seems to gain speed. 
      starShip.element.style.top = -flightSpeed * 20 + 730 + 'px'
    }
  }

  if (IS_DOWN_PRESSED == true && flightSpeed >= 0.05) {
    //decrease shipspeed and volume
    flightSpeed -= 0.01;
    if (shipVolume > 0.1) {
      shipVolume -= 0.01
    }
    ShipLowSpeed.volume = shipVolume
    starShip.element.style.top = -flightSpeed * 20 + 730 + 'px'
  }

}
//get a value to set the ship position on the x based on rotation
//aswell as speed of rotation. 
function checkRotationMovement() {
  //when facing to the right. the higher value on the right = how much the ship is rotated to the right
  if (master_rotation >= 0 && master_rotation <= 10) {
    ShipSpeedX = 0
  }
  if (master_rotation > 0 && master_rotation > 50 && master_rotation < 60) {
    ShipSpeedX = 0.1
  }
  if (master_rotation > 0 && master_rotation > 60 && master_rotation < 70) {
    ShipSpeedX = 0.2
  }
  if (master_rotation > 0 && master_rotation >= 70) {
    ShipSpeedX = 0.3
  }

  //when facing to the left. The higher value on the right = how much the ship is rotated to the right
  if (master_rotation < 0 && master_rotation < -50 && master_rotation > -60) {
    ShipSpeedX = -0.1
  }
  if (master_rotation < 0 && master_rotation < -60 && master_rotation > -70) {
    ShipSpeedX = -0.2
  }
  if (master_rotation < 0 && master_rotation <= -70) {
    ShipSpeedX = -0.3
  }

  // when facing left and the current position is within the max range 
  //movement will be applied on the x to give the illusion of movement as the ship manuevers.
  if (master_rotation < 0 && current_X > 600 && flightSpeed > 0.1) {
    moveLeft()
  }
  // when facing right and the current position is within the max range 
  //movement will be applied on the x to give the illusion of movement as the ship manuevers.
  if (master_rotation > 0 && current_X < 1000 && flightSpeed > 0.1) {
    moveRight()
  }
}
//check for key press events and set bools for input. 
function keyupHandler(event) {
  if (event.code === 'ArrowLeft') IS_LEFT_PRESSED = false
  if (event.code === 'ArrowRight') IS_RIGHT_PRESSED = false
  if (event.code === 'ArrowUp') IS_UP_PRESSED = false
  if (event.code === 'ArrowDown') IS_DOWN_PRESSED = false
  if (event.code === 'Numpad0') IS_SHOOT_PRESSED = false
}
//add avent listener to document, listen for keyhandler
document.addEventListener('keyup', keyupHandler)

function keydownHandler(event) {
  if (event.code === 'ArrowLeft') IS_LEFT_PRESSED = true
  if (event.code === 'ArrowRight') IS_RIGHT_PRESSED = true
  if (event.code === 'ArrowUp') IS_UP_PRESSED = true
  if (event.code === 'ArrowDown') IS_DOWN_PRESSED = true
  if (event.code === 'Numpad0') IS_SHOOT_PRESSED = true
}
//add avent listener to document, listen for keyhandler
document.addEventListener('keydown', keydownHandler)

function keypressHandler(event) {
  //if (event.code === 'Key')
}
//add avent listener to document, listen for keyhandler
document.addEventListener('keypress', keypressHandler)
////-------------------keypresses--------------------------------------------------------


//this is the player controlled object with its own class incase I need to add and remove
class StarShip {
  //define what makes up a "starship"
  constructor() {
    // create the HTML element
    this.element = document.createElement('img')
    // set its image
    this.element.src = Ship_img_src

    this.element.style.opacity = 1
    // set width
    this.element.style.width = '20px'
    // set height
    this.element.style.height = '40px'
    //set the position
    this.element.style.position = 'relative'
    this.element.style.left = current_X + "px"
    this.element.style.top = -flightSpeed * 20 + 730 + 'px'
    this.element.style.pointerEvents = "none";
    //for debugging collision
    this.element.style.border = "1px solid blue"
    // add it to the page
    document.body.appendChild(this.element)



  }

  SpawnParticle() {
    //add a new Particle from the Particle class to the Particle list
    Particles.push(new Particle())
    //increase the number of particles in the scene which will effect how for loops look at the list.
    num_Particles += 1
  }


}

//Asteroid class to spawn in new asteroids sharing the same characteristics.   
class Asteroid {
  constructor() {
    //turn off damage after asteroid is destroyed.
    var candoDamage = true;
    var Health = 1;
    this.Health = Health;
    //set this outside the bounds of the screen on start so the position resets.
    let Posx = 2000
    let Posy = 2000
    //each asteroid has inherent momentom which will aways effect position
    let speedY = 0.1
    //this ones random to give some variation to the movemovement for each asteroid
    let speedX = Math.floor(Math.random() * 2) - 2 / 5;
    //how fast the asteroid rotates. 
    let RotateSpeed = Math.floor(Math.random() * 1) - 1 / 20;
    this.RotateSpeed = RotateSpeed
    let normalRotation = master_rotation * 1 / 25
    this.speedY = speedY
    this.speedX = speedX
    this.Posx = Posx
    this.Posy = Posy
    //asteroids have a random size. this is also effected by the wave number.
    let AsteroidSize = (Math.floor(Math.random() * ScoreNum) * ScoreNum)
    this.AsteroidSize = AsteroidSize
    let Asteroid_Rotation = Math.min(Math.floor(Math.random() * 180))
    this.Asteroid_Rotation = Asteroid_Rotation

    //used as a bool when collision is detected. 
    var wasShipHit

    // create the HTML element
    this.element = document.createElement('img')
    // set image opacity
    this.element.style.opacity = Health
    // set its image
    this.element.src = asteroid_img_src
    // set width
    this.element.style.width = this.AsteroidSize + 'px'
    // set height
    this.element.style.height = this.AsteroidSize + 'px'



    //for debugging collision
    this.element.style.border = "1px solid black"

    // add it to the page
    document.body.appendChild(this.element)

    // make it respond to clicks
    this.element.onclick = this.clicked

    // start it in the top-left
    this.setXY(this.Posx, this.Posy)

  }
  RandomizeAsteroid() {
    //when the position resets, give this asteroid new size
    this.AsteroidSize = Math.min(Math.floor(Math.random() * 100) + 10)
    this.element.style.height = this.AsteroidSize + 'px'
    this.element.style.width = this.AsteroidSize + 'px'
  }

  //This will eventually be used when asteroids are destroyed. is broken now. 
  SpawnParticle() {
    num_Debris += 20
    this.candoDamage = false;
    //set a set sound instand and play it
    var AsteroidHit = new Audio('Lazer2.mp3');
    AsteroidHit.play();
    //set the image of the asteroid
    this.src = asteroid_explode_img_src
    //set asteroid health after explosion-
    // higher value under 1 will have a slower fade
    this.Health = 0.5;
    //increase player score.
    ScoreNum += 100;
    // console.log('asteroid clicked')

    this.setExplodedDamage()
    for (let i = 0; i < 20; i++) debris.push(new Debris())





    //num_Debris += 20
    for (let i = 0; i < num_Debris; i++) {
      debris[i].Posx = this.Posx + Math.min(Math.floor(Math.random() * 100) + 20);
      debris[i].Posy = this.Posy + Math.min(Math.floor(Math.random() * 100) - 20);
    }
  }
  //Check Collision and set bools if its detected between certain elements.
  CheckCollision() {
    this.wasShipHit = (isCollide(this.element, starShip.element))


    //this will be used when an asteroid is shot // not in yet
    //for (let i=0; i <num_Projectiles; i++)
    // {
    //  this.wasHit = (isCollide(this.element, projectiles[i].element))
    // }

    //if(this.wasHit && this.candoDamage)
    //  {
    //    //this.clicked()
    //    //this.SpawnParticle()
    //
    //    
    //    var rand = (Math.floor(Math.random() * (3 - 1 + 1)) + 1)
    //    if(rand == 1)
    //    {
    //      var ShipHit = new Audio('Asteroid_explosion1.mp3');
    //      ShipHit.volume = 0.3
    //       ShipHit.play();
    //    }
    //    if(rand == 2)
    //    {
    //      var ShipHit = new Audio('Asteroid_explosion2.mp3');
    //      ShipHit.volume = 0.3
    //      ShipHit.play();
    //    }
    //    if(rand == 3)
    //    {
    //      var ShipHit = new Audio('Asteroid_explosion3.mp3');
    //      ShipHit.volume = 0.3
    //      ShipHit.play();
    //    }
    //    this.candoDamage = false;
    //  }

    //when an asteroid hits the ship
    if (this.wasShipHit && this.candoDamage && LiveNum > -1) {
      //this will change the asteroid image before it resets
      LiveNum -= 1
      this.setExplodedDamage()

      //Randomizes which sound will be played, creates a-
      //Random number between 1 and 3 and sets the audio file to use based on that.
      var rand = (Math.floor(Math.random() * (3 - 1 + 1)) + 1)
      if (rand == 1) {
        var ShipHit = new Audio('Asteroid_explosion1.mp3');
        ShipHit.volume = 0.3
        ShipHit.play();
      }
      if (rand == 2) {
        var ShipHit = new Audio('Asteroid_explosion2.mp3');
        ShipHit.volume = 0.3
        ShipHit.play();
      }
      if (rand == 3) {
        var ShipHit = new Audio('Asteroid_explosion3.mp3');
        ShipHit.volume = 0.3
        ShipHit.play();
      }
      this.candoDamage = false;
    }
  }
  //adjust asteroid characteristics depending on wave // not ready to do anything with this
  checkwave() {
    //if (Wave7 && !Wave8 && !Wave9) {
    //  this.element.style.height = this.AsteroidSize 
    //  this.element.style.width = this.AsteroidSize  
    //}
    //if (Wave8 && !Wave9) {
    //  this.element.style.height = this.AsteroidSize 
    //  this.element.style.width = this.AsteroidSize 
    //}
    //if (Wave9) {
    //  this.element.style.height = this.AsteroidSize 
    //  this.element.style.width = this.AsteroidSize 
    //}
  }
  //for asteroid movement
  moveAsteroidDown() {

    this.Asteroid_Rotation += this.RotateSpeed
    //call a function to start decreasing the asterioid opacity if the health variable is less then 1
    this.setFade()
    this.CheckCollision()
    this.checkwave()


    //if the asteroid is beyond these points on the page
    if (this.Posy > max_y + 100 || this.Posx > max_x + 100 || this.Posx < -100) {

      var random = Math.min(Math.floor(Math.random() * 4))


      if (random == 1) {
        //the position of the asteroid on the x axis is set to a random position-
        //between two max values.
        this.Posx = Math.min(Math.floor(Math.random() * max_x), max_x - 50);
        this.Posy = -100;
      }

      if (random == 2) {
        //the position of the asteroid on the x axis is set to a random position-
        //between two max values.
        this.Posx = -200;
        this.Posy = Math.min(Math.floor(Math.random() * max_x), max_x - 50);
      }
      if (random == 3) {
        //the position of the asteroid on the x axis is set to a random position-
        //between two max values.
        this.Posx = max_x;
        this.Posy = Math.min(Math.floor(Math.random() * max_x), max_x - 50);
      }
      //reset the asteroid state
      this.setNotExploded()
      this.RandomizeAsteroid()
      this.candoDamage = true;
    }



    //Asteroid Movement---------

    //variables store values to later apply to the asteroids x and y position
    //the positions update each time this function loops,-
    //they travel at slightly different speeds. updating the x and y-
    //at the same time slows objects to travel at an angle.


    //this is the inherent speed of the asteroid
    //this data will always be applied.
    this.Posy += this.speedY
    this.Posx += this.speedX / 2

    //when moving
    if (flightSpeed > 0.05) {
      //The position will increase on the x in the oposite direction the player/ship is rotated.
      //the ships flightspeed will effect how quickly the asteroid moves.
      this.Posx += -master_rotation / 5 * flightSpeed / 10
      //when facing left
      if (master_rotation < 0) {
        //this will be used when an asteroid is shot // not in yet
        this.normalRotation = master_rotation * 1 / 80
        //if the speed to be applied wont make the movement go into the negative
        if (this.speedY + flightSpeed + this.normalRotation > 0) {
          //the asteroid position on the y will increase based on flightspeed and rotation. this isnt ideal.
          this.Posy += this.speedY + flightSpeed + this.normalRotation
        }
      }
      //if facing right
      if (master_rotation > 0) {
        //this will be used when an asteroid is shot // not in yet
        this.normalRotation = master_rotation * 1 / 80
        //if the speed to be applied wont make the movement go into the negative
        if (this.speedY + flightSpeed - this.normalRotation > 0) {
          //the asteroid position on the y will increase based on flightspeed and rotation. this isnt ideal.
          this.Posy += this.speedY + flightSpeed - this.normalRotation
        }
      }
    }



    //apply the values of the position variables to the asteroids actual position-
    //using a function within my asteroid class.
    this.setXY(this.Posx, this.Posy)

    //----Asteroid Movement-----
  }


  //this function lets me set an x and y value and apply it to this asteroid-
  setXY(x, y) {
    this.x = x
    this.y = y
    //then I set the elements position on the page to the x and y value
    this.element.style.position = 'fixed'
    this.element.style.left = this.x + "px"
    this.element.style.top = this.y + "px"
    this.element.style.transformOrigin = 'center'
    this.element.style.transform = 'rotate(' + this.Asteroid_Rotation + 'deg)'
  }



  //when an asteroid is destroyed it will become transparent and have a different image
  // this function will reset the opacity and image of the asteroid-
  //asteroids are reset only after reaching the bottom of the game area,
  //even if "destroyed" the asteroid will continue to fall until it reaches the boundry-
  //of the game area and is reset. this gives the illusion of new asteroids appearing
  //at random times, instead of as soon as destroyed.
  setNotExploded() {

    this.element.src = asteroid_img_src
    this.element.Health = 1;
    this.element.style.opacity = this.Health;

  }


  //this function is called when the asteroid reaches far enough down the page-
  //to hit the space ship, and changes the image to appear like-
  //it has hit something, before it is reset.
  setExplodedDamage() {
    this.element.src = asteroid_damage_img_src
  }


  //function is called when you click an asteroid.
  //changes the image and sets the health and score. 
  clicked() {
    this.candoDamage = false;
    //set a set sound instand and play it
    var AsteroidHit = new Audio('Lazer2.mp3');
    AsteroidHit.play();
    //set the image of the asteroid
    this.src = asteroid_explode_img_src
    //set asteroid health after explosion-
    // higher value under 1 will have a slower fade
    this.Health = 0.5;
    //increase player score.
    ScoreNum += 100;
    // console.log('asteroid clicked')

  }

  //when the asteroid is clicked and health is less then 1,
  //the opacity will decrease overtime until its invisable.  
  setFade() {
    if (this.element.Health < 1) {

      this.element.style.opacity -= 0.03
    }
  }

}

//not currently working
class Projectile {
  constructor() {
    let Posx = current_X - 20
    let Posy = -flightSpeed * 20 + 820
    this.Posx = Posx
    this.Posy = Posy
    let speed = 1
    this.speed = speed
    let RotationOnlaunch = master_rotation
    this.RotationOnlaunch = RotationOnlaunch
    let DespawnTimer = 1
    this.DespawnTimer = DespawnTimer
    // create the HTML element
    this.element = document.createElement('img')
    // set its image
    this.element.src = asteroid_img_src
    // set width
    this.element.style.width = 15 + 'px'
    // set height
    this.element.style.height = 15 + 'px'

    //for debugging collision
    this.element.style.border = "1px solid red"
    if (master_rotation < 0) {
      this.element.style.position = 'relative'
      this.element.style.left = -current_X + "px"
      this.element.style.top = this.y - flightSpeed * 10 + 730 + 'px'
    }
    if (master_rotation > 0) {
      this.element.style.position = 'relative'
      this.element.style.left = current_X + "px"
      this.element.style.top = this.y + -flightSpeed * 10 + 730 + 'px'
    }


    // add it to the page
    document.body.appendChild(this.element)

  }
  Holding() {
    this.setXY(this.Posx, this.Posy)
  }

  LaunchForward() {
    this.DespawnTimer -= 0.004
    if (this.DespawnTimer < 0) {
      canShoot = true
      this.element.remove()
    }

    //a bunch of crap I had to go through to get the projectile to shoot in the facing direction.
    //checks the master rotation on launch, and for each angle I set a the position to modify. 
    //facing left.
    if (this.RotationOnlaunch < 0) {

      if (this.RotationOnlaunch > -10) {
        this.Posy += -1 * 1
      }
      if (this.RotationOnlaunch <= - 10 && this.RotationOnlaunch > - 20) {
        this.Posy += -0.9 * 5
        this.Posx += -0.1 * 5  // this.speed
      }
      if (this.RotationOnlaunch <= - 20 && this.RotationOnlaunch > - 30) {
        this.Posy += -0.8 * 5
        this.Posx += -0.2 * 5
      }
      if (this.RotationOnlaunch <= - 30 && this.RotationOnlaunch > - 40) {
        this.Posy += -0.7 * 5
        this.Posx += -0.3 * 5
      }
      if (this.RotationOnlaunch <= - 40 && this.RotationOnlaunch > - 50) {
        this.Posy += -0.6 * 5
        this.Posx += -0.4 * 5
      }
      if (this.RotationOnlaunch <= - 50 && this.RotationOnlaunch > - 60) {
        this.Posy += -0.5 * 5
        this.Posx += -0.5 * 5
      }
      if (this.RotationOnlaunch <= - 50 && this.RotationOnlaunch > - 70) {
        this.Posy += -0.4 * 5
        this.Posx += -0.6 * 5
      }
      if (this.RotationOnlaunch <= - 60 && this.RotationOnlaunch > - 80) {
        this.Posy += -0.3 * 5
        this.Posx += -0.7 * 5
      }
      if (this.RotationOnlaunch <= - 80) {
        this.Posy += -0.2 * 5
        this.Posx += -0.8 * 5
      }
    }
    //facing right
    if (this.RotationOnlaunch > 0) {
      if (this.RotationOnlaunch < 10) {
        this.Posy += -1 * 5
      }
      if (this.RotationOnlaunch >= 10 && this.RotationOnlaunch < 20) {
        this.Posy += -0.9 * 5
        this.Posx += 0.1 * 5
      }
      if (this.RotationOnlaunch >= 20 && this.RotationOnlaunch < 30) {
        this.Posy += -0.8 * 5
        this.Posx += 0.2 * 5
      }
      if (this.RotationOnlaunch >= 30 && this.RotationOnlaunch < 40) {
        this.Posy += -0.7 * 5
        this.Posx += 0.3 * 5
      }
      if (this.RotationOnlaunch >= 40 && this.RotationOnlaunch < 50) {
        this.Posy += -0.6 * 5
        this.Posx += 0.4 * 5
      }
      if (this.RotationOnlaunch >= 50 && this.RotationOnlaunch < 60) {
        this.Posy += -0.5 * 5
        this.Posx += 0.5 * 5
      }
      if (this.RotationOnlaunch >= 50 && this.RotationOnlaunch < 70) {
        this.Posy += -0.4 * 5
        this.Posx += 0.6 * 5
      }
      if (this.RotationOnlaunch >= 60 && this.RotationOnlaunch < 80) {
        this.Posy += -0.3 * 5
        this.Posx += 0.7 * 5
      }
      if (this.RotationOnlaunch >= 80) {
        this.Posy += -0.2 * 5
        this.Posx += 0.8 * 5
      }
    }
    this.setXY(this.Posx, this.Posy)
  }
  setXY(x, y) {
    this.x = x
    this.y = y

    this.element.style.position = 'fixed'
    this.element.style.left = this.Posx + 'px'
    this.element.style.top = this.Posy + 'px'
    //then I set the elements position on the page to the x and y value

  }
}
class Particle {
  constructor() {
    let Posx = current_X
    let Posy = -flightSpeed * 20 + 840
    let normalRotation = 0
    let speedY = 0
    let speedX = 0
    let scrollspeed = Math.min(Math.floor(Math.random() * 10) + 1) / 20;
    this.scrollspeed = scrollspeed;
    this.speedY = speedY
    this.speedX = speedX
    this.Posx = Posx
    this.Posy = Posy
    let DespawnTimer = 1
    this.DespawnTimer = DespawnTimer

    // create the HTML element
    this.element = document.createElement('img')

    // set its image
    this.element.src = asteroid_img_src
    // set width
    this.element.style.width = this.scrollspeed * 20 + 'px'
    // set height
    this.element.style.height = this.scrollspeed * 20 + 'px'

    //for debugging collision
    this.element.style.border = "3px solid gray"

    this.element.style.zIndex = -1

    // add it to the page
    document.body.appendChild(this.element)

    // start it in the top-left
    this.setXY(this.Posx, this.Posy)

  }


  //for Partcicle movement relative to ship
  moveParticle() {
    this.element.style.opacity = this.DespawnTimer
    //despawn timer starts dropping when a new particle is created
    if (this.DespawnTimer < 0.01) {
      //removes the particles when the timer is 0
      this.element.remove()
    }
    if (this.DespawnTimer >= 0.01) {
      this.DespawnTimer -= 0.01
      //Particle Movement---------

      //variables store values to later apply to the asteroids x and y position
      //the positions update each time this function loops,-
      //they travel at slightly different speeds. updating the x and y-
      //at the same time slows objects to travel at an angle.

      //this is inherent movement
      this.Posy += this.scrollspeed / 10
      this.Posx += this.scrollspeed / 10

      //this works the same way as the asteroids to move relative to player input. 
      if (flightSpeed > 0.05) {

        this.Posx += -master_rotation / 5 * flightSpeed / 10
        if (master_rotation < 0) {
          this.normalRotation = master_rotation * 1 / 80
          if (flightSpeed + this.scrollspeed + this.normalRotation > 0) {
            this.Posy += flightSpeed + this.normalRotation + this.scrollspeed
          }
        }
        if (master_rotation > 0) {
          this.normalRotation = master_rotation * 1 / 80
          if (flightSpeed + this.scrollspeed - this.normalRotation > 0) {
            this.Posy += flightSpeed + this.scrollspeed - this.normalRotation
          }
        }
      }

      //apply the values of the position variables to the asteroids actual position-
      //using a function within the asteroid class.
      this.setXY(this.Posx, this.Posy)

    }



    //----Particle Movement-----
  }

  //this function lets me set an x and y value and apply it to this Star
  setXY(x, y) {
    this.x = x
    this.y = y
    //then I set the elements position on the page to the x and y value
    if (master_rotation < 0) {

      this.element.style.position = 'fixed'
      this.element.style.left = this.x + "px"
      this.element.style.top = this.y + master_rotation + 70 + "px"
    }
    if (master_rotation > 0) {
      this.element.style.position = 'fixed'
      this.element.style.left = this.x + "px"
      this.element.style.top = this.y + -master_rotation + 70 + "px"
    }

  }

}

//not in the game yet. but works the same way as particles except has a higher starting movement speed. 
class Debris {
  constructor() {

    let Posx = 200
    let Posy = 200
    let normalRotation = 0
    let speedY = 0
    let speedX = 0
    let scrollspeed = Math.min(Math.floor(Math.random() * 5) - 5) / 20;
    let RandomMovement = Math.min(Math.floor(Math.random() * 2) - 2);
    let RandomMovement2 = Math.min(Math.floor(Math.random() * 2) - 2);
    this.RandomMovement = RandomMovement
    this.RandomMovement2 = RandomMovement2
    this.scrollspeed = scrollspeed;
    this.speedY = speedY
    this.speedX = speedX
    this.Posx = Posx
    this.Posy = Posy
    let DespawnTimer = 1
    this.DespawnTimer = DespawnTimer

    // create the HTML element
    this.element = document.createElement('img')

    // set its image
    this.element.src = asteroid_img_src
    // set width
    this.element.style.width = Math.min(Math.floor(Math.random() * 2) + 1) / 20 + 'px'
    // set height
    this.element.style.height = Math.min(Math.floor(Math.random() * 2) + 1) / 20 + 'px'

    //for debugging collision
    this.element.style.border = "8px solid black"

    this.element.style.zIndex = -1

    // add it to the page
    document.body.appendChild(this.element)

    // set position 
    this.setXY(this.Posx, this.Posy)

  }


  //for Partcicle movement relative to ship
  moveParticle() {
    this.element.style.opacity = this.DespawnTimer
    if (this.DespawnTimer < 0.005) {
      this.element.remove()
      //this.DespawnTimer = 0
    }
    if (this.DespawnTimer >= 0.005) {
      this.DespawnTimer -= 0.005
      //Particle Movement---------

      //variables store values to later apply to the asteroids x and y position
      //the positions update each time this function loops,-
      //they travel at slightly different speeds. updating the x and y-
      //at the same time slows objects to travel at an angle.
      this.Posy += this.RandomMovement2 / 5
      this.Posx += this.RandomMovement / 5

      if (flightSpeed > 0.05) {


        if (master_rotation < 0) {
          this.Posx += flightSpeed / 100
          this.normalRotation = master_rotation * 1 / 80
          if (flightSpeed > 0) {
            this.Posy += flightSpeed
          }
        }
        if (master_rotation > 0) {
          this.Posx -= flightSpeed / 100
          this.normalRotation = master_rotation * 1 / 80
          if (flightSpeed > 0) {
            this.Posy += flightSpeed
          }
        }
      }

      //apply the values of the position variables to the asteroids actual position-
      //using a function within my asteroid class.
      this.setXY(this.Posx, this.Posy)

    }
    //----Star Movement-----
  }
  //this function lets me set an x and y value and apply it to this Star
  setXY(x, y) {
    this.x = x
    this.y = y
    //then I set the elements position on the page to the x and y value
    if (master_rotation < 0) {

      this.element.style.position = 'fixed'
      this.element.style.left = this.x + "px"
      this.element.style.top = this.y + master_rotation + 70 + "px"
    }
    if (master_rotation > 0) {
      this.element.style.position = 'fixed'
      this.element.style.left = this.x + "px"
      this.element.style.top = this.y + -master_rotation + 70 + "px"
    }

  }

}

class Star {
  constructor() {
    //set out of bounds so it begins by resetting
    let Posx = 9000
    let Posy = 9000
    let normalRotation = 0
    let speedY = 0
    let speedX = 0
    let scrollspeed = Math.min(Math.floor(Math.random() * 5) + 0.1) / 20;
    this.scrollspeed = scrollspeed;
    this.speedY = speedY
    this.speedX = speedX
    this.Posx = Posx
    this.Posy = Posy

    // create the HTML element
    this.element = document.createElement('img')

    // set its image
    this.element.src = asteroid_img_src
    // set width
    this.element.style.width = this.scrollspeed * 3 + 'px'
    // set height
    this.element.style.height = this.scrollspeed * 3 + 'px'

    //for debugging collision
    this.element.style.border = "1px solid white"

    this.element.style.zIndex = -1

    // add it to the page
    document.body.appendChild(this.element)

    // start it in the top-left
    this.setXY(this.Posx, this.Posy)

  }

  //for Star movement relative to ship
  moveStar() {
    //when the star is outside game bounds
    if (this.Posy > max_y + 100 || this.Posx > max_x + 100 || this.Posx < 0 - 100) {
      var random = Math.min(Math.floor(Math.random() * 4))

      if (random == 1) {
        //the position of the star on the x axis is set to a random position-
        //between two max values.
        this.Posx = Math.min(Math.floor(Math.random() * max_x), max_x - 50);
        this.Posy = Math.min(Math.floor(Math.random() * -100));
      }

      if (random == 2) {
        //the position of the asteroid on the x axis is set to a random position-
        //between two max values.
        this.Posx = Math.min(Math.floor(Math.random() * -100));;
        this.Posy = Math.min(Math.floor(Math.random() * max_y), max_y - 50);
      }
      if (random == 3) {
        //the position of the asteroid on the x axis is set to a random position-
        //between two max values.
        this.Posx = max_x + Math.min(Math.floor(Math.random() * 100))
        this.Posy = Math.min(Math.floor(Math.random() * max_y), max_y - 50);
      }
    }

    //Star Movement---------

    //variables store values to later apply to the asteroids x and y position
    //the positions update each time this function loops,-
    //they travel at slightly different speeds. updating the x and y-
    //at the same time slows objects to travel at an angle.

    //inherent movement
    this.Posy += this.scrollspeed / 10
    this.Posx += this.scrollspeed / 10

    //works the same as asteroids and applies changes to the position based on player input.
    if (flightSpeed > 0.05) {

      this.Posx += -master_rotation / 5 * flightSpeed / 10
      if (master_rotation < 0) {
        this.normalRotation = master_rotation * 1 / 80
        if (flightSpeed + this.scrollspeed + this.normalRotation > 0) {
          this.Posy += flightSpeed + this.normalRotation + this.scrollspeed
        }
      }
      if (master_rotation > 0) {
        this.normalRotation = master_rotation * 1 / 80
        if (flightSpeed + this.scrollspeed - this.normalRotation > 0) {
          this.Posy += flightSpeed + this.scrollspeed - this.normalRotation
        }
      }
    }
    //apply the values of the position variables to the asteroids actual position-
    //using a function within my asteroid class.
    this.setXY(this.Posx, this.Posy)

    //----Star Movement-----
  }
  //this function lets me set an x and y value and apply it to this Star
  setXY(x, y) {
    this.x = x
    this.y = y
    //then I set the elements position on the page to the x and y value
    this.element.style.position = 'fixed'
    this.element.style.left = this.x + "px"
    this.element.style.top = this.y + "px"
  }

}

//using the classes created above this will create new elements in the gamearea.
//sharing the same code and characteristics
//this is the max positions for the world.. I dont want to exceed this. 
let max_x = 1800
let max_y = 900

//create a new list
let Particles = []
num_Particles = 1
//for loop repeats the number of times equal to the num variable. Each time creating a new element in the list
for (let i = 0; i < num_Particles; i++) Particles.push(new Particle())

//create a new list
let debris = []
num_Debris = 1
//for loop repeats the number of times equal to the num variable. Each time creating a new element in the list
for (let i = 0; i < num_Debris; i++) debris.push(new Debris())

//create a new list
let asteroids = []
let num_asteroids = 1
//for loop repeats the number of times equal to the num variable. Each time creating a new element in the list
for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())

//create a new list
let stars = []
let num_stars = 50
//for loop repeats the number of times equal to the num variable. Each time creating a new element in the list
for (let i = 0; i < num_stars; i++) stars.push(new Star())

//create a new list
let projectiles = []
let num_Projectiles = 1
//for loop repeats the number of times equal to the num variable. Each time creating a new element in the list
for (let i = 0; i < num_Particles; i++) projectiles.push(new Projectile())

//create the Player ship
let starShip = new StarShip()


function Start() {
  //wait for input before setting game started true and before playing ship audio.
  if (IS_LEFT_PRESSED || IS_RIGHT_PRESSED) {
    ShipAccelerate.play();
    ShipLowSpeed.play();
    ShipAccelerate.volume = 0
    ShipLowSpeed.volume = 0.1
    gameStarted = true
  }
}

//this is the game Loop
function GameManager() {
  //this is the game level state
  //each wave I add another asteroid to the total on screen. 
  //wave is based on score, when score is above a certain point the wave is set to reflect it.
  if (!Wave1 && ScoreNum < 30000) {
    //num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave1 = true;
  }
  if (!Wave2 && ScoreNum > 60000) {
    num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave1 = false
    Wave2 = true;
  }
  if (!Wave3 && ScoreNum > 90000) {
    //num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave2 = false
    Wave3 = true;
  }
  if (!Wave4 && ScoreNum > 12000) {
    num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave3 = false
    Wave4 = true;
  }
  if (!Wave5 && ScoreNum > 15000) {
    //num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave4 = false
    Wave5 = true;
  }
  if (!Wave6 && ScoreNum > 18000) {
    //num_asteroids += 1
    //for (let i=0;i<num_asteroids;i++) asteroids.push(new Asteroid())
    Wave5 = false
    Wave6 = true;
  }
  if (!Wave7 && ScoreNum > 20000) {
    //num_asteroids += 1
    //for (let i=0;i<num_asteroids;i++) asteroids.push(new Asteroid())
    Wave6 = false
    Wave7 = true;
  }
  if (!Wave8 && ScoreNum > 26000) {
    num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave7 = false
    Wave8 = true;
  }
  if (!Wave9 && ScoreNum > 280000) {
    //num_asteroids += 1
    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave8 = false
    Wave9 = true;
  }
  if (!Wave10 && ScoreNum > 300000) {
    num_asteroids += 1

    for (let i = 0; i < num_asteroids; i++) asteroids.push(new Asteroid())
    Wave9 = false
    Wave10 = true;
  }
  if (!gameStarted) {
    Start();
  }

  //these are the core functions for the game to run
  updatescore();
  checkInput();
  checkRotationMovement();
  //turnBackround();

  //for loop, looped a number of times = to the num variable for that object
  //for each object, run a function. 
  //the game manager is in charge of updating all the movement of the different elements.
  for (let i = 0; i < num_asteroids; i++) {
    asteroids[i].moveAsteroidDown()
  }
  for (let i = 0; i < num_stars; i++) {
    stars[i].moveStar()
  }
  for (let i = 0; i < num_Particles; i++) {
    Particles[i].moveParticle()
  }
  for (let i = 0; i < num_Projectiles; i++) {
    projectiles[i].LaunchForward()
  }
  for (let i = 0; i < num_Debris; i++) {
    debris[i].moveParticle()
  }

}



function isCollide(a, b) {
  //when this function is called it will get the data about the bounding rect for item a and b.
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !
    (
      //check if the rectangles overlap. 
      ((aRect.top + aRect.height) < (bRect.top)) ||
      (aRect.top > (bRect.top + bRect.height)) ||
      ((aRect.left + aRect.width) < bRect.left) ||
      (aRect.left > (bRect.left + bRect.width))
      //Detecting collision using bounding client rect doesnt take rotation into account. 
      //will need to update this later to use circles 
    );
}

//set the current score.
function updatescore() {
  //when moving
  if (flightSpeed > 0) {
    //score increases by flightspeed each tic. Math.trunc removes the decimal. 
    ScoreNum += Math.trunc(flightSpeed)
  }
  //Updates the Html text to display the values in my score and lives variables.
  Scorecount.innerHTML = "Distance:" + " " + ScoreNum
  Lifecount.innerHTML = "Lives:" + " " + LiveNum

  //Resets the score and lives when lives run out and display gameover
  if (LiveNum < 0) {
    window.alert('You exploded.. Try again?')
    //after gameover alert is clicked, asteroid positions and score/lives are reset.
    for (let i = 0; i < num_asteroids; i++) {
      asteroids[i].setNotExploded();
      asteroids[i].Posy = 0.1;
    }
    ScoreNum = 0
    LiveNum = 9
  }
}

//set the function to repeat on an interval
setInterval(GameManager, 6)

//creates and element on screen called game area and defines various parameters.
let gamearea = document.createElement('div')
//Makes it so backround elements arent effected by pointer clicks
gamearea.style.pointerEvents = "none";
gamearea.style.position = 'fixed'
gamearea.style.top = '0px'
gamearea.style.left = '0px'
gamearea.style.width = max_x + "px"
gamearea.style.height = max_y + "px"
gamearea.style.border = "1px solid white"

//makes sure this element renders behind everything else by giving it the lowest index
gamearea.style.zIndex = -999
//adds the element to the document
document.body.appendChild(gamearea)
//set the speed at which the asteroid movement function is called.
//A lower number gives quicker smoother movement
//interval = setInterval(moveAsteroidDown,12)






