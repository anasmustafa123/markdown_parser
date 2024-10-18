class GraphNode {
  private children: GraphNode[];
  private type: string;
  private tag: string;
  get_tag() {
    return this.tag;
  }
  get_type() {
    return this.type;
  }
  get_children() {
    return this.children;
  }
  is_root() {
    return this.tag === "root";
  }
  add_child(child: GraphNode) {
    this.children.push(child);
  }
}

class Graph {
  private root: GraphNode;
  get_root() {
    return this.root;
  }
  constructor() {
    this.root = new GraphNode();
  }
}

export { Graph, GraphNode };