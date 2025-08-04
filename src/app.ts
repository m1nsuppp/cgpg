import { Graph, Node } from './graph';

(() => {
  const graph = new Graph();

  const node1 = new Node('1', 'Node 1');
  const node2 = new Node('2', 'Node 2');
  const node3 = new Node('3', 'Node 3');

  graph.addNode(node1);
  graph.addNode(node2);
  graph.addNode(node3);

  graph.addEdge(node1, node2);
  graph.addEdge(node2, node3);
  graph.addEdge(node3, node1);

  console.log(graph);
})();
