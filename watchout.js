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
    // .attr('style', 'fill:#010002;')
    // .attr('d', 'M24.379,33.023l13.705,5.06l-5.06-13.706c-0.076,0.093-0.158,0.184-0.244,0.271c-1.324,1.324-3.43,1.365-4.819,0.152l-2.365-2.365c1.106-2.136,1.103-4.698-0.019-6.829l1.877-1.876c0,0.003,0.001,0.004,0.001,0.005h0.052c0.083-0.104,0.17-0.204,0.266-0.3c1.383-1.383,3.625-1.383,5.00 6 ,0c0.088,0.087,0.17,0.178,0.246,0.271l5.059-13.705L24.378,5.061c0.093,0.076,0.184,0.158,0.271,0.245c1.323,1.324,1.365,3.429,0.152,4.819l-2.365,2.365c-2.136-1.107-4.698-1.102-6.829,0.018l-1.876-1.876c0.001,0,0.002-0.001,0.003-0.002v-0.052c-0.104-0.083-0.204-0.17-0.3-0.266c-1.383-1.383-1.383-3.624,0-5.007c0.087-0.087,0.178-0.168,0.271-0.245L0,0l5.059,13.706c0.076-0.093,0.158-0.184,0.245-0.271c1.324-1.324,3.429-1.366,4.819-0.153l2.365,2.365c-1.107,2.136-1.102,4.698,0.018,6.83l-1.876,1.875c0,0-0.001-0.002-0.002-0.002h-0.052c-0.083,0.104-0.17,0.203-0.266,0.299c-1.383,1.384-3.624,1.384-5.006,0c-0.087-0.086-0.169-0.178-0.245-0.271L0.001,38.084l13.706-5.06c-0.093-0.076-0.184-0.157-0.271-0.244c-1.324-1.324-1.366-3.43-0.153-4.819l2.365-2.365c2.136,1.107,4.699,1.103,6.83-0.018l1.875,1.876c0,0-0.002,0.001-0.003,0.002v0.052c0.104,0.083,0.204,0.17,0.3,0.267c1.383,1.383,1.383,3.623,0,5.006C24.564,32.867,24.472,32.948,24.379,33.023z M19.042,21.655c-1.442,0-2.611-1.17-2.611-2.611c0-1.442,1.169-2.611,2.611-2.611c1.441,0,2.611,1.169,2.611,2.611C21.653,20.485,20.484,21.655,19.042,21.655z')
    .attr('class', 'enemy')
    .attr('cx', x)
    .attr('cy', y)
    .attr('data-newx', x)
    .attr('data-newy', y)
    .attr('r', 10);
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

















