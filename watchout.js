// start slingin' some d3 here.

var gameOptions = {
  height: 500,
  width: 500,
  numberOfEnemies: 30,
  playerRadius: 10
};

var scores = {
  currentScore: 0,
  highScore: 0
};

var gameSpace = d3.select('body').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

// enemies = [];

// var Enemy = function(x, y) {
//   this.x;
//   this.y;
// };

for (var i = 0; i < gameOptions.numberOfEnemies; i++) {
  var x = Math.random() * gameOptions.width;
  var y = Math.random() * gameOptions.height;
  gameSpace.append('circle')
    .attr('class', 'enemy')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 10);
}

var currentScore = d3.select('.current').select('span');
var highScore = d3.select('.high').select('span');

setInterval(function() {
  highScore.text(scores.highScore);
  currentScore.text(scores.currentScore);
  scores.currentScore += 10;
  var randomX = 0;
  var randomY = 0;
  d3.selectAll('.enemy')
    .transition()
    .attr('cx', function() {
      randomX = Math.random() * gameOptions.width;
      return randomX;
    })
    .attr('data-newx', randomX)
    .attr('cy', function() {
      randomY = Math.random() * gameOptions.height;
      return randomY;
    })
    .attr('data-newy', randomY)
    .duration(1000)
    // .transition()
    // .duration(2000)
    .tween('custom', tweenWithCollisionDetection);
}, 2000);

var player = {
  x: gameOptions.width / 2,
  y: gameOptions.height / 2,
  radius: gameOptions.playerRadius
};

// Define drag beavior
var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  if (x < player.radius) {
    x = player.radius;
  }
  if (x > gameOptions.width - player.radius) {
    x = gameOptions.width - player.radius;
  }
  if (y < player.radius) {
    y = player.radius;
  }
  if (y > gameOptions.height - player.radius) {
    y = gameOptions.height - player.radius;
  }
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
  player.x = x;
  player.y = y;
}

// add player
gameSpace.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', player.radius)
  .attr('fill', 'red')
  .attr('transform', 'translate(' + player.x + ',' + player.y + ')')
  .call(drag);

checkCollision = function(enemy, collidedCallback) {
  var radiusSum, separation, xDiff, yDiff;
  radiusSum = parseFloat(enemy.attr('r')) + player.radius;
  xDiff = parseFloat(enemy.attr('cx')) - player.x;
  yDiff = parseFloat(enemy.attr('cy')) - player.y;
  separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  if (separation < radiusSum) {
    return collidedCallback(player, enemy);
  }
};

onCollision = function() {

  console.log('collision occurred!!!!!');
  if (scores.currentScore > scores.highScore) {
    scores.highScore = scores.currentScore;
  }
  scores.currentScore = 0;

};


tweenWithCollisionDetection = function(endData) {
  var endPos, enemy, startPos;
  enemy = d3.select(this);
  startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };
  endPos = {
    x: parseFloat(enemy.attr('data-newx')),
    y: parseFloat(enemy.attr('data-newy'))
  };
  return function(t) {
    var enemyNextPos;
    checkCollision(enemy, onCollision);
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };
    return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
  };
};
// return enemies.transition().duration(500).attr('r', 10)

















