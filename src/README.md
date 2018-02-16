# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) WDI32 Project #1: Jimba, The Cropdusting Pug

### Overview

For our first project, we were given a week to independently design and build an in-browser game using HTML, CSS and JavaScript (jQuery was optional).

I chose to use my dog, Simba, and his flatulent habits as inspiration for this game. The player controls 'Jimba' on the board and has to fart in the path of the his apricot counterpart 'Evil Jimba' to score points. It features different power ups and boosts to extend game play and also gets harder as time goes on and 'Evil Jimba' gathers speed.

#####[Visit the website](https://peaceful-sands-40579.herokuapp.com/) on a desktop for the best playing experience (this game was not designed for mobile).

---

### About Jimba

Jimba, The Cropdusting Pug is a grid based single player game. It is coded in HTML, CSS and vanilla JavaScript. The player can use WASD or the ARROW keys to move and spacebar to release gas! As the player progresses the speed of 'Evil Jimba' increases and it becomes harder to successfully 'cropdust' the enemy and score points.

When the game starts, a map is chosen at random from a library and impassable walls are placed in different areas to make movement more interesting. Jimba and Evil Jimba are restricted to move in the free spaces of the grid and cannot move past the edge.

The game is points based and has one level which progressively gets harder. The player starts with enough in the tank for roughly 15 farts, more can be gained by walking into the chicken drumsticks which get randomly generated on the board.

The player is initially given 60 seconds on the clock to gain as many points as possible, the time can be increased by collecting clocks which are randomly generated on the board.

Evil Jimba's movement is very similar to Jimba's. Both cannot move off the grid or walk into walls. Evil Jimba faces in one direction initially and will continue to walk in that direction until he comes across an edge or a wall, once this happens, he chooses another direction at random and continues forward until he meets another obstacle.

If Jimba comes into contact with the enemy, he is heavily penalised and loses points and energy. It is vital to not do this if the player wishes to get a top score!

---

### The Process

To begin, I split the game into smaller tasks, these looked like the following:

* **Generate grid with height * width variables**
I wanted my grid to have the potential to be scalable if needed, by storing the height and width of the grid as a variable and using these variables to generate the grid, I could switch the values out and produce a bigger/ smaller grid if needed.

* **Put Jimba in, make him move, make sure he cannot move past the edge of the grid**

* **Make the first map & walls, Jimba can't move past walls**

* **Give Jimba the ability to fart**

* **Create an enemy, make it move using an algorithm (move in one direction until it reaches the end of the grid, turn repeat)**

---

### Final Notes

I am very pleased with the way my game functions and plays given the amount of time I had to complete it. I really enjoyed coding it and hope to continue working on it in the future. Most of the animated assets were hand drawn and I'm very proud of them!
