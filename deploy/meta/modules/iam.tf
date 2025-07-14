locals {
  github_service_account_roles = [
    "roles/secretmanager.viewer",
    "roles/secretmanager.secretAccessor",
    "roles/artifactregistry.createOnPushWriter",
    "roles/storage.admin",
    "roles/run.admin",
    "roles/iam.serviceAccountUser",
    "roles/vpcaccess.admin",
  ]
  compute_engine_service_account_roles = [
    "roles/secretmanager.secretAccessor",
    "roles/cloudsql.client",
  ]
}

data "google_project" "google_project" {
  project_id = var.project_id
}

resource "google_service_account" "github_service_account" {
  account_id   = "github"
  display_name = "GitHub Service Account"
}

resource "google_iam_workload_identity_pool" "workload_identity_pool" {
  workload_identity_pool_id = "workload-identity-pool"
  project                   = var.project_id
  display_name              = "Workload Identity Pool"
}

resource "google_iam_workload_identity_pool_provider" "github_workload_identity_pool_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.workload_identity_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider"
  display_name                       = "GitHub Provider"
  description                        = "GitHub Workload Identity Pool Provider."
  attribute_condition                = "assertion.repository_owner == '${var.github_organization}'"
  attribute_mapping = {
    "google.subject"             = "assertion.sub"
    "attribute.actor"            = "assertion.actor"
    "attribute.repository"       = "assertion.repository"
    "attribute.repository_owner" = "assertion.repository_owner"
  }
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_member" "github_workload_identity_user" {
  service_account_id = google_service_account.github_service_account.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.workload_identity_pool.name}/attribute.repository/${var.github_organization}/${var.github_repository}"
}

resource "google_project_iam_member" "github_service_account_roles" {
  for_each = toset(local.github_service_account_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.github_service_account.email}"
}

resource "google_project_iam_member" "compute_engine_service_account_roles" {
  for_each = toset(local.compute_engine_service_account_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${data.google_project.google_project.number}-compute@developer.gserviceaccount.com"
}