variable "project_name" {
  type = string
}

variable "service_name" {
  type = string
}

variable "region" {
  type = string
}

variable "description" {
  type = string
  default = null
}

variable "labels" {
  type = map(string)
  default = {}
}

variable "annotations" {
  type = map(string)
  default = {}
}

variable "ingress" {
  type = string
  default = "INGRESS_TRAFFIC_ALL"
}

variable "deletion_protection" {
  type = bool
  default = false
}

variable "invoker_iam_disabled" {
  type = bool
  default = true
}

variable "template" {
  type = object({
    labels = optional(map(string), {})
    annotations = optional(map(string), {})
    timeout = optional(string, "10s")
    max_instance_request_concurrency = optional(number, 100)
    scaling = optional(object({
      min_instance_count = number
      max_instance_count = number
    }),
    {
      min_instance_count = 0
      max_instance_count = 1
    })
    vpc_access = optional(object({
      connector = optional(string, null)
      egress = optional(string, "PRIVATE_RANGES_ONLY")
    }), null)
  })
  default = {
    labels = {}
    annotations = {}
    timeout = "10s"
    max_instance_request_concurrency = 100
    scaling = {
      min_instance_count = 0
      max_instance_count = 1
    }
  }
}

variable "container" {
  type = object({
      env = optional(list(object({
        name  = string
        value = optional(string, "")
      })), [])

      ports = optional(list(object({
        container_port = number
        name           = string
      })), [{
        name = "http1"
        container_port = 8080
      }])

      resources = optional(object({
        limits = object({
          cpu    = optional(string, "1000m")
          memory = optional(string, "512Mi")
        })
        cpu_idle = optional(bool, true)
        startup_cpu_boost = optional(bool, false)
      }), {
        limits = {
          cpu    = "1000m"
          memory = "512Mi"
        }
        cpu_idle = true
        startup_cpu_boost = false
      })
    })
  default = {
    env = []
    ports = []
    resources = {
      limits = {
        cpu    = "1000m"
        memory = "512Mi"
      }
      cpu_idle = true
      startup_cpu_boost = false
    }
  }
}

variable "sidecar" {
    type = object({
        command = optional(list(string), [])
        args = optional(list(string), [])
    })
    default = null
}

variable "scaling" {
  type = object({
    min_instance_count = optional(number, 0)
    scaling_mode = optional(string, "AUTOMATIC")
    manual_instance_count = optional(number, 0)
  })
  default = {
    min_instance_count = 0
    scaling_mode = "AUTOMATIC"
    manual_instance_count = 0
  }
}

variable "traffic" {
  type = object({
    type    = string
    percent  = number
  })
  default = {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent  = 100
  }
}

variable "launch_stage" {
  type = string
  default = "BETA"
}

variable "registry_host" {
  type = string
  default = "docker.pkg.dev"
}

variable "project_id" {
  type = string
}

variable "image_tag" {
  type = string
}