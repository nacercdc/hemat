resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "${var.project_name}-repo"
  format        = var.gcr_format

  docker_config {
    immutable_tags = var.gcr_immutable_tags
  }

  cleanup_policies {
    id     = "${var.project_name}-gcr-cleanup-policy"
    action = var.gcr_cleanup_policy_action
    condition {
      newer_than = var.gcr_cleanup_policy_condition_newer_than
    }
  }
}