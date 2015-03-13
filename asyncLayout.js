var createForceLayout = require('ngraph.forcelayout');
var fromJSON = require('ngraph.fromjson');
var posIdx = 0;
var total;
var points;
var layout;
var graph;

self.onmessage = function(e) {
  var data = e.data;
  if (data.cmd === 'init') {
    graph = fromJSON(data.graph);
    total = graph.getNodesCount();
    layout = createForceLayout(graph);
    //setInterval(step, 30);
  } else if (data.cmd === 'next') {
    step();
  }

  // self.postMessage(ab.buffer, [ab.buffer]);
  // var ab = new Uint8Array(10);
  // for (var n = 0; n < ab.length; n++) ab[n] = 1;
  // self.postMessage(ab.buffer, [ab.buffer]);
};


function step() {
  layout.step();
  posIdx = 0;
  points = new Float64Array(total * 2);
  graph.forEachNode(updatePosition);
  self.postMessage(points.buffer, [points.buffer]);
}

function updatePosition(node) {
  var posInArray = posIdx * 2;
  var pt = layout.getNodePosition(node.id);
  points[posInArray] = pt.x;
  points[posInArray + 1] = pt.y;
  posIdx += 1;
}
