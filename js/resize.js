function resize() {
  
  // Decide whether we're in mobile or desktop mode. Currently doing this by window width, but we could look to
  // https://www.w3schools.com/howto/howto_js_media_queries.asp for more device-specific solutions
  if(window.innerWidth > 425) { // sufficiently wide desktop windows
    waterUseViz.mode = 'desktop';
  } else { // most mobile devices (except iPads) plus narrow desktop windows
    waterUseViz.mode = 'mobile';
  }
  
  // Calculate new dimensions with adaptations for ~desktop vs ~mobile
  if(waterUseViz.mode === 'desktop') {
  
    // buttonBox is at the left and centered vertically
    waterUseViz.dims.buttonBox.y0 = (waterUseViz.dims.map.height/2) - (waterUseViz.dims.buttonBox.height/2);
    waterUseViz.dims.buttonBox.width = waterUseViz.dims.buttonBox.widthDesktop;
    waterUseViz.dims.buttonBox.height = waterUseViz.dims.buttonBox.heightDesktop;
    // map fills the full svg
    waterUseViz.dims.map.x0 = waterUseViz.dims.buttonBox.width;
    // svg is [buttons][map]
    waterUseViz.dims.svg.width = waterUseViz.dims.buttonBox.width + waterUseViz.dims.map.width;
    waterUseViz.dims.svg.height = waterUseViz.dims.map.height;
    // watermark is at bottom left
    waterUseViz.dims.watermark.x0 = waterUseViz.dims.svg.width * 0.01;
    waterUseViz.dims.watermark.y0 = waterUseViz.dims.svg.height * 0.95;
    
  } else {
  
    // buttonBox sits below map with small vertical buffer between map and buttons
    waterUseViz.dims.buttonBox.y0 = waterUseViz.dims.map.height * 1.05;
    waterUseViz.dims.buttonBox.width = waterUseViz.dims.map.width;
    waterUseViz.dims.buttonBox.height = waterUseViz.dims.buttonBox.width *
      (waterUseViz.dims.buttonBox.heightDesktop / waterUseViz.dims.buttonBox.widthDesktop);
    // map fills the top part of the svg
    waterUseViz.dims.map.x0 = 0;
    // svg is [map]
    //        [buttons]
    waterUseViz.dims.svg.width = waterUseViz.dims.map.width;
    waterUseViz.dims.svg.height = waterUseViz.dims.buttonBox.y0 + waterUseViz.dims.buttonBox.height;
    // watermark is at bottom right
    waterUseViz.dims.watermark.x0 = waterUseViz.dims.svg.width * 0.85;
    waterUseViz.dims.watermark.y0 = waterUseViz.dims.svg.height * 0.95;
  }
  
  // Apply the changes to the svg, map, map background, and watermark
  svg
    .attr('viewBox', '0 0 ' + waterUseViz.dims.svg.width + ' ' + waterUseViz.dims.svg.height + '');
  map
    .attr('transform', 'translate(' + waterUseViz.dims.map.x0 + ', ' + 0 + ')');
  mapBackground
    .attr("width", waterUseViz.dims.svg.width)
    .attr("height", waterUseViz.dims.map.height);
  watermark
    .attr('transform', 'translate(' + waterUseViz.dims.watermark.x0 + ',' + waterUseViz.dims.watermark.x0 + ')scale(0.25)');
  
  // Apply the changes to the button elements
  waterUseViz.elements.buttonBox
    .attr('transform', 'translate(' + 0 + ', ' + waterUseViz.dims.buttonBox.y0 + ')');
  waterUseViz.elements.buttonBox.select('#button-background')  
    .attr('width', waterUseViz.dims.buttonBox.width);
  waterUseViz.elements.buttonBox.selectAll('.button .category-label')
    .attr('x', waterUseViz.dims.buttonBox.width * 0.05); // nudge a little over from the rectangle's left edge
  waterUseViz.elements.buttonBox.selectAll('.button .category-amount')
    .attr('x', waterUseViz.dims.buttonBox.width * 0.9); // nudge a little over from the rectangle's left edge
  updateButtons(activeCategory); // updates the button rectangle widths
  
}
