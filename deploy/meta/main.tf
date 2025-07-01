module "meta" {
  source  = "git::http://167.172.181.51/etm/tf_modules.git//gcp/cloud_run/meta?ref=main"

  name            = var.name
  project_id      = var.project_id
  region          = var.region
  environment     = var.environment
  repository      = var.repository
  organization    = var.organization
  gitlab_username = var.gitlab_username
  gitlab_token    = var.gitlab_token
  github_secrets  = var.github_secrets
  env_secrets     = var.env_secrets
}