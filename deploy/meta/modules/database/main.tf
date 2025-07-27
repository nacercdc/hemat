locals {
  databases = concat(
    var.database_names,
    ["${var.project_name}-db"]
  )
}

#  Create a Password for DB root password
resource "random_password" "pwd" {
  length  = 16
  special = false
}

# Create a Cloud SQL instance
resource "google_sql_database_instance" "database_instance" {
  name = "${var.project_name}-database-instance"
  region = var.region
  database_version = var.database_version
  deletion_protection = var.deletion_protection

  settings {
    tier = var.tier
    edition = var.edition
    user_labels = var.user_labels
    availability_type = var.availability_type
    disk_size = var.disk_size
    disk_autoresize = var.disk_autoresize
    disk_autoresize_limit = var.disk_autoresize_limit
    disk_type = var.disk_type
    pricing_plan = var.pricing_plan
    retain_backups_on_delete = var.retain_backups_on_delete
    
    backup_configuration {
      enabled = var.backup_configuration.enabled
      start_time = var.backup_configuration.start_time
    }

    ip_configuration {
      ipv4_enabled = var.ipv4_enabled
      
      dynamic "authorized_networks" {
        for_each = var.authorized_networks
        content {
          name  = each.key
          value = each.value
        }
      }
    }
  }

  root_password = random_password.pwd.result

  lifecycle {
    ignore_changes = [settings[0].disk_size, settings[0].disk_autoresize]
  }

  depends_on = [ random_password.pwd ]
}

# Create a database user
resource "google_sql_user" "db_user" {
  name     = "${var.project_name}-database-user"
  instance = google_sql_database_instance.database_instance.name
  password = random_password.pwd.result

  depends_on = [ google_sql_database_instance.database_instance, random_password.pwd ]
}

# Create a database
resource "google_sql_database" "db" {
  for_each = toset(local.databases)

  name     = each.value
  instance = google_sql_database_instance.database_instance.name

  depends_on = [google_sql_database_instance.database_instance, google_sql_user.db_user]
}

resource "google_secret_manager_secret" "database_password" {
  secret_id = "DATABASE_PASSWORD"
  replication {
    user_managed {
      replicas {
        location = var.region
      }
    }
  }
}

resource "google_secret_manager_secret_version" "database_password_value" {
  secret      = google_secret_manager_secret.database_password.id
  secret_data = "${google_sql_user.db_user.password}"

  depends_on = [ google_secret_manager_secret.database_password ]
}