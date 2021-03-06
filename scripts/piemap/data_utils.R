get_dots <- function(json_file, data_file, proj.string="+proj=longlat +datum=WGS84", state_name = NULL){
  
  centroids <- read_json(json_file)$objects$centroids$geometries
  centroid_meta <- read_tsv(data_file)
  
  NA_out <- rep(NA, length(centroids))
  
  pt_coords <- matrix(data = c(NA_out, NA_out), ncol = 2)
  
  dot_data <- data.frame(total = NA_out, thermoelectric = NA_out, 
                         publicsupply = NA_out, irrigation = NA_out, industrial = NA_out)
  
  
  for (j in seq_len(length(centroids))){
    this_dot <- centroids[[j]]
    coord <- this_dot$coordinates
    state_abb <- this_dot$properties$STATE_ABBV
    
    if (is.null(state_name) || state_abb == state_name){
      pt_coords[j, ] <- c(coord[[1]][1], coord[[2]][1])
    }
    this_meta <- filter(centroid_meta, GEOID == this_dot$properties$GEOID)[names(dot_data)]
    dot_data[j, ] <- this_meta
  }
  
  dot_data$state <- sapply(centroids, function(x) x$properties$STATE_ABBV)
  
  points <- pt_coords[!is.na(pt_coords[, 1]), ] %>% 
    sp::SpatialPoints(proj4string = CRS("+proj=longlat +datum=WGS84")) %>% 
    sp::spTransform(CRS(proj.string)) %>% 
    sp::SpatialPointsDataFrame(data = dot_data[!is.na(pt_coords[, 1]), ])
  
  
  return(points)
}
