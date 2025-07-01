variable "name" {
  description = "Name of the project"
  type = string
}

variable "gitlab" {
  description = "GitLab URL"
  type = string
}

variable "gitlab_project_id" {
  description = "GitLab project ID"
  type = string
}

variable "repository" {
  description = "Name of the Git repository."
  type        = string
}

variable "organization" {
  description = "GitHub organization name."
  type        = string
  
}

variable "env_secrets" {
  description = "Map of environment variable names to their values."
  type        = map(string)
}

variable "github_secrets" {
  description = "Map of GitHub secrets to be created."
  type        = map(string)
}

variable "project_id" {
  description = "Google Cloud project ID."
  type        = string
}

variable "region" {
  description = "Google Cloud region for resources."
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "gitlab_token" {
  description = "GitLab access token for API operations"
  type        = string
}

variable "gitlab_username" {
  description = "GitLab username for API operations"
  type        = string  
}