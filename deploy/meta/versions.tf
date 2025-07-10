terraform {
  required_version = ">= 1.4.6"

  required_providers {
    google = {
      source = "hashicorp/google"
      version = "6.39.0"
    }
    random = {
      source = "hashicorp/random"
      version = "3.7.2"
    }
  }
  backend "gcs" {}
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}