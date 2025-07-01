terraform {
  required_version = ">= 1.4.6"

  required_providers {
    gitlab = {
      source = "gitlabhq/gitlab"
      version = "18.0.0"
    }
    google = {
      source = "hashicorp/google"
      version = "6.39.0"
    }
    github = {
      source = "integrations/github"
      version = "6.6.0"
    }
    random = {
      source = "hashicorp/random"
      version = "3.7.2"
    }
  }

  backend "http" {
    lock_method    = "POST"
    unlock_method  = "DELETE"
    retry_wait_min = 5
  }
}

provider "github" {
  owner = var.organization
}