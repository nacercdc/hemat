resource "google_secret_manager_secret" "secret" {
  for_each = var.secrets

  secret_id = "${each.key}"

  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }

}

resource "google_secret_manager_secret_version" "secret_version" {
  for_each    = var.secrets

  secret      = google_secret_manager_secret.secret[each.key].id
  secret_data = each.value

  depends_on = [ google_secret_manager_secret.secret ]
}