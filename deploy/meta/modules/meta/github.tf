provider "github" {
  owner = var.github_organization
}

resource "github_repository_environment" "env" {
  environment = var.environment
  repository  = var.github_repository
}

resource "github_actions_environment_secret" "gcp_project_id" {
  repository      = var.github_repository
  environment     = var.environment
  secret_name     = "GCP_PROJECT_ID"
  plaintext_value = var.project_id

  depends_on = [github_repository_environment.env]
}

resource "github_actions_environment_secret" "gcp_service_account_email" {
  repository      = var.github_repository
  environment     = var.environment
  secret_name     = "GCP_SERVICE_ACCOUNT_EMAIL"
  plaintext_value = google_service_account.github_service_account.email

  depends_on = [github_repository_environment.env]
}

resource "github_actions_environment_secret" "gcp_workload_identity_provider" {
  repository      = var.github_repository
  environment     = var.environment
  secret_name     = "GCP_WORKLOAD_IDENTITY_PROVIDER"
  plaintext_value = google_iam_workload_identity_pool_provider.github_workload_identity_pool_provider.name

  depends_on = [github_repository_environment.env]
}

resource "github_actions_environment_secret" "custom" {
  for_each        = var.github_secrets

  repository      = var.github_repository
  environment     = var.environment
  secret_name     = each.key
  plaintext_value = each.value

  depends_on = [github_repository_environment.env]
}