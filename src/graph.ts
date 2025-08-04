export class Node<Value = unknown> {
  id: string;
  value: Value;
  neighbors: Array<Node<Value>>;

  constructor(id: string, value: Value) {
    this.id = id;
    this.value = value;
    this.neighbors = [];
  }

  addNeighbor(node: Node<Value>): void {
    if (!this.neighbors.some((n) => n.id === node.id)) {
      this.neighbors.push(node);
    }
  }

  removeNeighbor(node: Node<Value>): void {
    this.neighbors = this.neighbors.filter((n) => n.id !== node.id);
  }
}

export class Graph<Value = unknown> {
  nodes: Array<Node<Value>>;

  constructor() {
    this.nodes = [];
  }

  findNodeById(id: string): Node<Value> | undefined {
    return this.nodes.find((n) => n.id === id);
  }

  hasNode(node: Node<Value>): node is Node<Value> {
    return this.nodes.some((n) => n.id === node.id);
  }

  addNode(node: Node<Value>): void {
    if (!this.hasNode(node)) {
      this.nodes.push(node);
    }
  }

  removeNode(node: Node<Value>): void {
    this.nodes.forEach((n) => {
      n.removeNeighbor(node);
    });

    this.nodes = this.nodes.filter((n) => n.id !== node.id);
  }

  addEdge(source: Node<Value>, destination: Node<Value>): void {
    if (!this.hasNode(source) || !this.hasNode(destination)) {
      throw new Error('노드가 그래프에 존재하지 않습니다');
    }

    const actualSource = this.findNodeById(source.id);
    const actualDestination = this.findNodeById(destination.id);
    if (actualSource === undefined || actualDestination === undefined) {
      throw new Error('노드가 그래프에 존재하지 않습니다');
    }

    actualSource.addNeighbor(actualDestination);
    actualDestination.addNeighbor(actualSource);
  }

  removeEdge(source: Node<Value>, destination: Node<Value>): void {
    if (!this.hasNode(source) || !this.hasNode(destination)) {
      throw new Error('노드가 그래프에 존재하지 않습니다');
    }

    const actualSource = this.findNodeById(source.id);
    const actualDestination = this.findNodeById(destination.id);
    if (actualSource === undefined || actualDestination === undefined) {
      throw new Error('노드가 그래프에 존재하지 않습니다');
    }

    actualSource.removeNeighbor(actualDestination);
    actualDestination.removeNeighbor(actualSource);
  }
}
