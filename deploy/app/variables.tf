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
  default = "main-4bb9673"
}

variable "project_id" {
  type = string
}