resource "google_cloud_run_v2_job" "migrate_job" {
  count               = var.sidecar != null ? 1 : 0
  name                = "${var.project_name}-${var.service_name}-migrate-job"
  location            = var.region
  deletion_protection = var.deletion_protection

  template {
    template {
      containers {
        image   = local.image_path
        command = var.sidecar.command
        resources {
          limits = {
            "cpu" = var.container.resources.limits.cpu
            "memory" = var.container.resources.limits.memory
          }
        }
        # env {
        #   name = "DATABASE_URL"
        #   value = "postgresql://${var.project_name}-database-user:${data.google_secret_manager_secret_version.database_password_value.secret_data}@localhost/${var.project_name}-db?host=/cloudsql/${data.google_sql_database_instance.database_instance.connection_name}"
        # }

        dynamic "env" {
          for_each = var.container.env
          content {
            name  = env.value.name
            value = env.value.value
          }
        }

        dynamic "env" {
          for_each = local.secrets
          content {
            name = env.value
            value_source {
              secret_key_ref {
                secret = env.value
                version = "latest"
              }
            }
          }
        }

        # volume_mounts {
        #   mount_path = "/cloudsql"
        #   name       = "cloudsql"
        # }
      }

      # volumes {
      #   name = "cloudsql"
      #   cloud_sql_instance {
      #     instances = [data.google_sql_database_instance.database_instance.connection_name]
      #   }
      # }
    }
  }
}

resource "null_resource" "trigger_job" {
  count = var.sidecar != null ? 1 : 0

  depends_on = [
    google_cloud_run_v2_service.service,
    google_cloud_run_v2_job.migrate_job
  ]

  triggers = {
    always_run = "${timestamp()}"
  }  

  provisioner "local-exec" {
    command = "gcloud run jobs execute ${google_cloud_run_v2_job.migrate_job[0].name} --region ${var.region} --project ${var.project_id}"
  }
}