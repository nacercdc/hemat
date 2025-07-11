variable "project_name" {
  type = string
}

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "github_repository" {
  type = string
}

variable "github_organization" {
  type = string
}

variable "secrets" {
  type = map(string)
  default = {}
}

variable "environment" {
  type = string
  default = "development"
}

variable "github_secrets" {
  type = map(string)
  default = {}
}

variable "gcr_format" {
  type    = string
  default = "DOCKER"
}

variable "gcr_immutable_tags" {
  type    = bool
  default = true
}

variable "gcr_cleanup_policy_action" {
  type    = string
  default = "KEEP"
}

variable "gcr_cleanup_policy_condition_newer_than" {
  type    = string
  default = "14d"
}