variable "project_name" {
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
  default = "pr-96-6adbb64"
}

variable "project_id" {
  type = string
}