document.addEventListener('DOMContentLoaded', function() {
  // Set the dimensions and margins of the diagram
  const margin = {top: 20, right: 200, bottom: 20, left: 200};
  const width = document.getElementById('tree-diagram').clientWidth - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Append the svg object to the div with id "tree-diagram"
  const svg = d3.select("#tree-diagram").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the tree layout
  const treemap = d3.tree().size([height, width]);

  // Sample data for the tree diagram
  const treeData = {
      name: "Total Population",
      children: [
          { name: "Computer Science (20)" },
          { name: "Electrical Engineering (15)" },
          { name: "Mechanical Engineering (25)" },
          { name: "Biomedical Engineering (10)" }
      ]
  };

  // Assigns parent, children, height, depth
  const root = d3.hierarchy(treeData, function(d) { return d.children; });
  treemap(root);

  // Add links between nodes
  svg.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; }));

  // Add each node as a group
  const node = svg.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", function(d) { 
          return "node" + (d.children ? " node--internal" : " node--leaf"); 
      })
      .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
      });

  // Add a circle to represent each node
  const nodeEnter = node.append("circle")
      .attr("r", 0) // initial radius 0
      .attr("fill", "#fff")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5);

  // Transition nodes to their new size
  nodeEnter.transition()
      .duration(750)
      .attr("r", 4.5);

  // Add a label to each node
  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", function(d) { 
          return d.children ? -8 : 8; 
      })
      .style("text-anchor", function(d) {
          return d.children ? "end" : "start";
      })
      .text(function(d) { return d.data.name; })
      .style("fill-opacity", 0)
      .transition()
      .duration(750)
      .style("fill-opacity", 1);


// Variable to keep track of the currently selected node
let selectedNode = null;

// Add a click event listener to each node
node.on('click', function(event, d) {
  // Check if it is a leaf node
  if (!d.children) {
    // If there is a selected node and it's this node, deselect it
    if (selectedNode === this) {
      d3.select(this).select('circle')
        .style('fill', '#fff'); // Change color back to white
      selectedNode = null; // Deselect node
    } else {
      // If there is a selected node, change its color back to white
      if (selectedNode) {
        d3.select(selectedNode).select('circle')
          .style('fill', '#fff');
      }
      // Select this node and change its color to red
      d3.select(this).select('circle')
        .style('fill', 'red');
      selectedNode = this; // Update the currently selected node
    }
  }
});
});