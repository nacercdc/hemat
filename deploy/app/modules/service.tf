resource "google_cloud_run_v2_service" "service" {
    name = "${var.project_name}-${var.service_name}"
    location = var.region
    description = var.description != null ? var.description : "Cloud Run Service for ${var.service_name} in ${var.project_name} project."
    labels = var.labels
    annotations = var.annotations
    ingress = var.ingress
    deletion_protection = var.deletion_protection
    invoker_iam_disabled = var.invoker_iam_disabled
    launch_stage = var.launch_stage

    template {
        labels = var.template.labels
        annotations = var.template.annotations
        timeout = var.template.timeout
        max_instance_request_concurrency = var.template.max_instance_request_concurrency

        scaling {
            min_instance_count = var.template.scaling.min_instance_count
            max_instance_count = var.template.scaling.max_instance_count
        }

        containers {
            image = local.image_path

            resources {
                limits = {
                    "cpu" = var.container.resources.limits.cpu
                    "memory" = var.container.resources.limits.memory
                }
                cpu_idle = var.container.resources.cpu_idle
                startup_cpu_boost = var.container.resources.startup_cpu_boost
            }

            dynamic "ports" {
                for_each = var.container.ports
                content {
                    name            = ports.value.name
                    container_port = ports.value.container_port
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
            #     mount_path = "/cloudsql"
            #     name       = "cloudsql"
            # }
        }

        # volumes {
        #   name = "cloudsql"
        #   cloud_sql_instance {
        #     instances = [data.google_sql_database_instance.database_instance.connection_name]
        #   }
        # }
    }

    scaling {
        min_instance_count = var.scaling.min_instance_count
        scaling_mode = var.scaling.scaling_mode
        manual_instance_count = var.scaling.manual_instance_count
    }

    traffic {
        type = var.traffic.type
        percent = var.traffic.percent
    }
}