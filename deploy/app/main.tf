module "web" {
  source = "./modules"

  project_name = var.project_name
  service_name = "web"
  region       = var.region
  project_id   = var.project_id
  image_tag    = var.image_tag
}

module "hemat_api" {
  source = "./modules"

  project_name = var.project_name
  service_name = "hemat-api"
  region       = var.region
  project_id   = var.project_id
  image_tag    = var.image_tag
}