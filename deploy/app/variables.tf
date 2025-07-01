variable "name" {
  description = "Name of the project"
  type = string
}

variable "region" {
  type = string
}

variable "environment" {
  description = ""
  type = string
}

variable "image_tag" {
  type = string
  default = "latest"
}

variable "project_id" {
  description = "Google Cloud project ID"
  type = string
}

variable "registry_host" {
  description = "Artifact Registry host"
  type = string
}