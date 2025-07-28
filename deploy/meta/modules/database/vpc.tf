# Create a VPC network
# resource "google_compute_network" "vpc_ntw" {
#   count = var.ipv4_enabled ? 0 : 1
#   name = "${var.project_name}-vpc-ntw"
# }

# # Reserve a global internal IP for VPC
# resource "google_compute_global_address" "private_ip_range" {
#   count        = var.ipv4_enabled ? 0 : 1
#   name          = "${var.project_name}-private-ip-range"
#   purpose       = var.private_ip_purpose
#   address_type  = var.private_ip_address_type
#   prefix_length = var.private_ip_prefix_length
#   network       = var.ipv4_enabled ? null : google_compute_network.vpc_ntw[0].id

#   depends_on    = [ google_compute_network.vpc_ntw ]
# }

# # Create VPC peering connection for Service Networking
# resource "google_service_networking_connection" "private_connection" {
#   count                   = var.ipv4_enabled ? 0 : 1
#   network                 = var.ipv4_enabled ? null : google_compute_network.vpc_ntw[0].id
#   service                 = "servicenetworking.googleapis.com"
#   reserved_peering_ranges = var.ipv4_enabled ? [] : [google_compute_global_address.private_ip_range[0].name]

#   depends_on = [ google_compute_network.vpc_ntw, google_compute_global_address.private_ip_range ]
# }

# # Create a VPC access connector for Cloud Run
# resource "google_vpc_access_connector" "connector" {
#   count         = var.ipv4_enabled ? 0 : 1 
#   name          = "${var.project_name}-connector"
#   network       = var.ipv4_enabled ? null : google_compute_network.vpc_ntw[0].self_link
#   ip_cidr_range = var.vpc_connector_cidr
#   min_instances = var.vpc_connector_instances.min
#   max_instances = var.vpc_connector_instances.max
#   machine_type  = var.vpc_connector_machine_type
#   region        = var.region
# }