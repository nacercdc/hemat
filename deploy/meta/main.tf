module "meta" {
  source  = "git::https://github.com/etmsoftware/tf-modules.git//gcp/cloud_run/meta?ref=main"

  name            = var.name
  project_id      = var.project_id
  region          = var.region
  environment     = var.environment
  repository      = var.repository
  organization    = var.organization
  http_username   = var.http_username
  http_token      = var.http_token
  github_secrets  = var.github_secrets
  env_secrets     = var.env_secrets
}