const svg = d3.select('svg g');

const element = document.getElementById("mainContent");
console.log("Width: " + element.offsetWidth + "px");
console.log("Height: " + element.offsetHeight + "px");

const width = +element.offsetWidth;
const height = +element.offsetHeight;

const centerX = width / 2;
const centerY = height / 2;


let myZoom = d3.zoom()
	.on('zoom', handleZoom);

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}

function initZoom() {
  d3.select('svg')
    .call(myZoom);
}

initZoom();
//FUNCTIONS
function resetZoom() {
  myZoom.transform(svg, d3.zoomIdentity);
}

function redraw() {  
  d3.selectAll("svg g > *").remove(); //remove everything from the svg
   // Rebind data to links

  lines = svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', (link) => link.color || 'black')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray',(link) => link.dash || "5,5");

  // Rebind data to circles
  circles = svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('fill', (node) => node.color || 'gray')
    .attr('r', (node) => node.size || 10)
    .on("click", (event, d) => { focusNode(d.id); });

  // Rebind data to text
  text  = svg.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('font-size','12')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('pointer-events', 'none')
    .text((node) => node.archetype_id);

  // Update simulation nodes and links
  simulation.nodes(nodes);
  //simulation.force('link').links(links);
  simulation.force('link', d3.forceLink(links).id(function (d) {return d.id;}).distance(150));

}


function getConnectedNodes(nodeId) {
  // Create a Set to store connected node IDs
  let connectedIds = new Set();

  // Loop through each link to find connections
  links = [];
  nodes = [];
  allLinks.forEach(link => {
      if (link.source === nodeId & link.group === 'INCLUDE') {
          connectedIds.add(link.target);
          links.push({'source' : link.source, 'target': link.target, 'dash': "5,5", 'color':'lightgray'});
      } 
      else if (link.source === nodeId & link.group === 'PARENT') { // this node is a child of a parent
        connectedIds.add(link.target);
        links.push({'source' : link.source, 'target': link.target, 'dash': "10,0", 'color':'gray'});
      } 
      
      else if (link.target === nodeId & link.group === 'PARENT') { // this node is a parent of a child
          connectedIds.add(link.source);
          links.push({'source' : link.source, 'target': link.target, 'dash': "10,0", 'color':'red'}); //just doing links.push(link) is very strange;
      }
  });
  // Filter nodes to return the actual node objects
  //return nodes.filter(node => connectedIds.has(node.id));
  nodes = allNodes.filter(node => connectedIds.has(node.id));
  nodes.push(allNodes.find(n => n.id === nodeId))
  }

function focusNode(nodeId) {
  console.log('Focusing on:', nodeId)
  const selected = allNodes.find(n => n.id === nodeId);
  if (!selected) return;

  getConnectedNodes(nodeId);

 
  nodes.forEach(n => {
    n.fx = null;
    n.fy = null;
    n.color = 'gray';
  });

  // Fix node position to center (if using force simulation)
  selected.fx = width / 2;
  selected.fy = height / 2;
  selected.color = 'red';

  console.log(nodes);
 
  redraw();
  resetZoom();
  //restart simulation
  simulation.alpha(1).restart();

  
  // Show in info box
  document.getElementById("info").innerHTML = `
      <strong>Node Info:</strong><br>
      <!--ID: ${selected.id}<br>-->
      <u>Archetype:</u> ${selected.archetype_id}<br><br>
      <u>Keywords:</u> ${selected.keywords}<br><br>
      <u>Purpose:</u> ${selected.purpose}<br><br>
      <!--<u>Group:</u> ${selected.group}-->
  `;
  //create a list of nodes to show
  
}

//Simulation, circles, links, text
let simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-1000))
  .force('link', d3.forceLink(links).id(function (d) {return d.id;}).distance(150))
  //.force('center', d3.forceCenter(centerX, centerY))
  //.alphaDecay(0)
  ;


let lines = svg
  .selectAll('line')
  .data(links)
  .enter()
  .append('line')
  .attr('stroke', (link) => link.color || 'black')
  .attr('stroke-width',1)
  .attr('stroke-dasharray',(link) => link.dash);

let circles = svg
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('fill', (node) => node.color || 'gray')
  .attr('r', (node) => node.size || 10)
  .on("click", (event,d) =>{focusNode(d.id);})
  ;

let text = svg
  .selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('pointer-events', 'none')
  .text((node) => node.archetype_id);
     
simulation.on('tick', () => {
  circles
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y);
  
  text.attr('x', (node) => node.x).attr('y', (node) => node.y);

  lines
    .attr('x1', (link) => link.source.x)
    .attr('y1', (link) => link.source.y)
    .attr('x2', (link) => link.target.x)
    .attr('y2', (link) => link.target.y);
    
});


//SEARCH FUNCTION
const searchInput = document.getElementById("search");
const resultsList = document.getElementById("results");

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  resultsList.innerHTML = "";

  if (query === "") return;

  const matches = allNodes.filter(d =>
      d.archetype_id.toLowerCase().includes(query) ||
      d.keywords.toLowerCase().includes(query) ||
      d.purpose.toLowerCase().includes(query)
  );

  matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = `${match.archetype_id}`;
      li.style.cursor = "pointer";
      li.style.padding = "4px";
      li.style.borderBottom = "1px solid #ddd";

      li.addEventListener("click", function () {
          focusNode(match.id);
          resultsList.innerHTML = ""; // Clear search results
          searchInput.value = ""; // Optional: clear input
      });

      resultsList.appendChild(li);
  });
});

