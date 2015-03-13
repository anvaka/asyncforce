var createForceLayout = require('ngraph.forcelayout');

var query = require('query-string').parse(window.location.search.substring(1));
var isAsync = query.isAsync;
var tojson = require('ngraph.tojson');
module.exports = layoutE;

function layoutE(graph) {
  var total = graph.getNodesCount();
  var points = new Float64Array(total * 2);
  var layout = createForceLayout(graph);
  var posIdx = 0;
  var getPoints = getPointsSync;

  if (isAsync) {
    var worker = new Worker('./asyncLayout.js');
    var nextStep = { cmd : 'next' };
    worker.postMessage({
      cmd: 'init',
      graph: tojson(graph)
    });
    worker.onmessage = function (e) {
      points = new Float64Array(e.data);
    };
    getPoints = getPointsAsync;
  }

  return {
    getPositions: getPoints
  };

  function getPointsSync() {
    layout.step();
    posIdx = 0;
    graph.forEachNode(updatePosition);
    return points;
  }

  function getPointsAsync() {
    worker.postMessage(nextStep);
    return points;
  }

  function updatePosition(node) {
    var posInArray = posIdx * 2;
    var pt = layout.getNodePosition(node.id);
    points[posInArray] = pt.x;
    points[posInArray + 1] = pt.y;
    posIdx += 1;
  }
}
