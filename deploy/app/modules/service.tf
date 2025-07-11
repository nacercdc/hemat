locals {
  image_path = "${var.region}-${var.registry_host}/${var.project_id}/${var.project_name}-repo/${var.project_name}-${var.service_name}:${var.image_tag}"
  secrets = toset([for s in data.google_secret_manager_secrets.all.secrets : split("/", s.name)[length(split("/", s.name))-1]])
}

data "google_secret_manager_secrets" "all" {
  project = var.project_id
}

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
            
        }

        dynamic "containers" {
          for_each = var.sidecar != null ? [var.sidecar] : []
          iterator = sidecar
          content {
            image = local.image_path
            command = sidecar.value.command
            args = sidecar.value.args

            resources {
                limits = {
                    "cpu" = var.container.resources.limits.cpu
                    "memory" = var.container.resources.limits.memory
                }
                cpu_idle = var.container.resources.cpu_idle
                startup_cpu_boost = var.container.resources.startup_cpu_boost
            }

            dynamic "env" {
                for_each = var.container.env
                content {
                    name  = env.value.name
                    value = env.value.value
                    dynamic "value_source" {
                        for_each = env.value.value_source.secret_key_ref.secret != null ? [env.value.value_source] : []
                        content {
                            secret_key_ref {
                                secret  = value_source.value.secret_key_ref.secret
                                version = value_source.value.secret_key_ref.version
                            }
                        }
                    }
                }
            }
          }
        }
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

    timeouts {
      create = "5m"
      update = "5m"
      delete = "5m"
    }
}