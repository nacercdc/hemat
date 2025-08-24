variable "location" {
  type    = string
  default = "southafricanorth"
}
variable "project_name" { type = string } # e.g. "hiemat"
variable "environment" { type = string }  # e.g. "dev", "prod"
variable "resource_tags" {
  type    = map(string)
  default = {}
}

# New VNet in target RG
variable "target_vnet_cidr" {
  type    = string
  default = "10.50.0.0/16"
}
variable "cae_subnet_cidr" {
  type    = string
  default = "10.50.0.0/24"
}

# Existing "core" resources (already created)
variable "core_rg_name" {
  type    = string
  default = "rg-africacdc-core"
}
variable "core_vnet_name" {
  type    = string
  default = "africacdc-infra-core-vnet"
}
variable "acr_name" {
  type    = string
  default = "africacdc"
}
variable "log_analytics_workspace_name" {
  type    = string
  default = "africacdc-core-law"
}
variable "storage_account_name" {
  type    = string
  default = "africacdccoresta"
} # e.g. africacdcorstorage
variable "key_vault_name" {
  type    = string
  default = "africacdc-core-kv"
} # e.g. africacdc-kv

# container images (already built in CI and pushed to ACR)
variable "image_tag" { type = string } # commit SHA

# Database settings
variable "pg_server_name" {
  type    = string
  default = "africacdc-core-dev-pgserv"
} # Flexible Server name
variable "postgres_database" {
  type    = string
  default = "appdb"
}

# Storage
variable "storage_containers" {
  type    = list(string)
  default = ["uploads"]
}
