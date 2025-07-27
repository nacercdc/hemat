variable "project_name" {
  type = string
}

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "zone" {
  type = string
}

variable "database_version" {
  type = string
  default = "POSTGRES_17"
}

variable "deletion_protection" {
  type = bool
  default = false
}

variable "tier" {
  type = string
  default = "db-f1-micro"
}

variable "edition" {
  type = string
  default = "ENTERPRISE"
}

variable "user_labels" {
  type = map(string)
  default = {}
}

variable "availability_type" {
  type    = string
  default = "ZONAL"
}

variable "disk_size" {
  type    = number
  default = 10
}

variable "disk_autoresize" {
  type    = bool
  default = true
}

variable "disk_autoresize_limit" {
  type    = number
  default = 40
}

variable "disk_type" {
  type    = string
  default = "PD_SSD"
}

variable "pricing_plan" {
  type    = string
  default = "PER_USE"
}

variable "retain_backups_on_delete" {
  type    = bool
  default = false
}

variable "backup_configuration" {
  type = object({
    enabled = optional(bool, false)
    start_time = optional(string, null)
  })
  default = {
    enabled = false
    start_time = null
  }
}

variable "ipv4_enabled" {
  type    = bool
  default = false
}

variable "private_ip_purpose" {
  type    = string
  default = "VPC_PEERING"
}

variable "private_ip_address_type" {
  type    = string
  default = "INTERNAL"
}

variable "private_ip_prefix_length" {
  type    = number
  default = 20
}

variable "vpc_connector_cidr" {
  type    = string
  default = "10.8.8.0/28"
}

variable "vpc_connector_machine_type" {
  type    = string
  default = "fl-micro"
}

variable "vpc_connector_instances" {
  type = object({
    min = number
    max = number
  })
  default = {
    min = 2
    max = 10
  }
}

variable "database_names" {
  type = list(string)
  default = []
}

variable "authorized_networks" {
  type = map(string)
  default = {}
}