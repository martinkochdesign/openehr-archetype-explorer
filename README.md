# openEHR Archetype Explorer 

The explorer can be accessed [here](https://martinkochdesign.github.io/openehr-archetype-explorer/).

## Motivation

When working on the modelling of clinical data structures in openEHR,
even at the archetype level, the interconnections of parent-child relationships and the possible inclusion of additional archetypes create complex networks. To facilitate fast and convenient searching within this network, it was suggested that a simple search tool with visualization of interconnections would be highly beneficial.

We created this demo as a basis for further discussion about the necessary functions and the usefulness of such a tool.

## Technical nitty-gritty
Archetypes were exported in bulk from the [international CKM](https://ckm.openehr.org/ckm/) in XML format. 
The archetype data was parsed by opening each archetype via a Python script. The archetype "node" data and "links" between them are saved in "dataset.js".

Additional data (for example, the CID from the CKM) was downloaded via the CKM REST API.

The visualization is handled by the D3.js library.

## General overview
In the general view we have different elements:

1. Title section with information about the date of the archetype data used here
2. Network visualization
3. Search bar
4. List of search results
5. Back button
6. Information of the currently active archetype node

![General view](/pics/0001.png)

### Node network

1. The red node indicates the currently active archetype.

2. The grey nodes represent archetypes that are connected to the active archetype, either by a parent-child or an inclusion relationship.

3. A continuous grey line indicates that the connected archetype is the parent of the currently active archetype.

4. A continuous red line indicates that the connected archetype is a child of the currently active archetype.

5. A dashed grey line indicates that the connected archetype can be included in the currently active archetype.

6. In some cases, archetypes have the inclusion criteria of "*", which means that any archetype can be included. Instead of creating a connection to all archetypes, the placeholder "any_archetype" is shown.

![Image of the node network](/pics/0002.png)

## Moving around
**Zoom** - Use the mouse wheel to zoom in and out of the network visualization

**Pan** - Click and hold the left mouse button on the network and move it around by moving the mouse.

**Select node** - You can click with the left mouse button on a node to make it the active node.

**Search** - Type in a search term and the list of found items will be updated.

**Search results** - Click on an item in the search result list to make it the currently active node.

**Back button** - The page tracks the history of active nodes. When pressing the "Back" button, the previous node will be set to active.

## License and Authorship
(c) 2025, CatSalut, Martin A. Koch, PhD. [Contact via mail](mailto:/martinandreaskoch@catsalut.cat)<br>Licensed under the Apache License, Version 2.0 
