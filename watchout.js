// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
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

for (var i = 0; i < gameOptions.numberOfEnemies; i++) {
  var x = Math.random() * gameOptions.width;
  var y = Math.random() * gameOptions.height;
  gameSpace.append('circle')
    .attr('class', 'enemy')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 10);
}

setInterval(function() {
  d3.selectAll('.enemy')
    .transition()
    .attr('cx', function() {
      return Math.random() * gameOptions.width;
    })
    .attr('cy', function() {
      return Math.random() * gameOptions.height;
    })
    .duration(1000);
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
  this.x = x;
  this.y = y;
}

gameSpace.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', player.radius)
  .attr('fill', 'red')
  .attr('transform', 'translate(' + player.x + ',' + player.y + ')')
  .call(drag);




















