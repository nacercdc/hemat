module "web" {
  source = "git::http://167.172.181.51/etm/tf_modules.git//gcp/cloud_run/app?ref=main"
  
  name            = var.name
  service         = "web"
  project_id      = var.project_id
  region          = var.region
  image_tag       = var.image_tag
  create_job      = false
  database_access = false
  vpc_access      = false

   resource = {
    cpu    = "1000m"
    memory = "2Gi"
  }
}

module "hemat_api" {
  source = "git::http://167.172.181.51/etm/tf_modules.git//gcp/cloud_run/app?ref=main"
  
  name            = var.name
  service         = "hemat-api"
  project_id      = var.project_id
  region          = var.region
  image_tag       = var.image_tag
  create_job      = false
  database_access = false
  vpc_access      = false
}