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
variable "pg_server_name" {
  type    = string
  default = "africacdc-core-dev-pgserv"
} # Flexible Server name

# KV secret you want to manage at secret-scope
variable "kv_secret_name" {
  type    = string
  default = "hemat-secrets"
}

# container images (already built in CI and pushed to ACR)
variable "image_tag" { type = string } # commit SHA

# GitHub OIDC inputs
variable "github_org" { type = string }  # e.g. "etmsoftware"
variable "github_repo" { type = string } # e.g. "africa-cdc"
variable "github_ref" { type = string }  # e.g. "refs/heads/main"

# Database settings
variable "postgres_admin_user" {
  type    = string
  default = "pgadmin"
}
variable "postgres_admin_password" {
  type      = string
  sensitive = true
}
variable "postgres_database" {
  type    = string
  default = "appdb"
}

# Storage
variable "storage_containers" {
  type    = list(string)
  default = ["uploads"]
}

# Key Vault secrets you want to create initially
variable "initial_secrets" {
  type    = map(string)
  default = {}
} # e.g. { "JWT_SECRET" = "..." }
