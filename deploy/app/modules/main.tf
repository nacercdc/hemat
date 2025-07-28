locals {
  image_path = "${var.region}-${var.registry_host}/${var.project_id}/${var.project_name}-repo/${var.project_name}-${var.service_name}:${var.image_tag}"
  secrets = toset([for s in data.google_secret_manager_secrets.all.secrets : split("/", s.name)[length(split("/", s.name))-1]])
}

data "google_secret_manager_secrets" "all" {
  project = var.project_id
}

# data "google_secret_manager_secret_version" "database_password_value" {
#   secret = "DATABASE_PASSWORD"
# }

# data "google_sql_database_instance" "database_instance" {
#   name = "${var.project_name}-database-instance"
# }