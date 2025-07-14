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