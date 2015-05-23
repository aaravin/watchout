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

// $ is for D3 selections
var $currentScore = d3.select('.current').select('span');
var $highScore = d3.select('.high').select('span');

var gameSpace = d3.select('body').append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)
  .attr('style', 'background: url("background.jpg"); background-size: 100% 100%');

var pattern = gameSpace.append('defs').append('pattern')
  .attr('id', 'shuriken')
  .attr('width', 15)
  .attr('height', 15);

var image = pattern.append('image')
  .attr('id', 'shurikenImage')
  .attr('xlink:href', 'shuriken2.png')
  .attr('width', 22)
  .attr('height', 22);

var playerPattern = gameSpace.append('defs').append('pattern')
  .attr('id', 'pacman')
  .attr('width', 15)
  .attr('height', 15);

var playerImage = playerPattern.append('image')
  .attr('id', 'pacmanImage')
  .attr('xlink:href', 'pacman.png')
  .attr('width', 22)
  .attr('height', 22); 

var animation = image.append('animateTransform')
  .attr('attributeName', 'transform')
  .attr('attributeType', 'XML')
  .attr('type', 'rotate')
  .attr('from', '0 11 11')
  .attr('to', '360 11 11')
  .attr('dur', '0.5s')
  .attr('repeatCount', 'indefinite');

for (var i = 0; i < gameOptions.numberOfEnemies; i++) {
  var x = Math.random() * gameOptions.width;
  var y = Math.random() * gameOptions.height;
  gameSpace.append('circle')
    .attr('class', 'enemy')
    .attr('cx', x)
    .attr('cy', y)
    .attr('data-newx', x)
    .attr('data-newy', y)
    .attr('r', 10)
    .style('fill', 'url(#shuriken)');
}

setInterval(function() {
  $highScore.text(scores.highScore);
  $currentScore.text(scores.currentScore);
  scores.currentScore += 1;
}, 50);

setInterval(function() {
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
    .duration(1500)
    // .transition()
    // .duration(2000)
    .tween('custom', tweenWithCollisionDetection);
}, 1500);

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
  .style('fill', 'url(#pacman)')
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
    // console.log(enemyNextPos);
    return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
  };
};
// return enemies.transition().duration(500).attr('r', 10)

















