module "meta" {
  source              = "./modules/meta"
  
  project_name        = var.project_name
  project_id          = var.project_id
  region              = var.region
  github_repository   = var.github_repository
  github_organization = var.github_organization
  secrets             = var.secrets
  environment         = var.environment
  github_secrets      = var.github_secrets
}