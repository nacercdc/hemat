variable "resource_group" { type = string }
variable "location" { type = string }
variable "name_prefix" { type = string }
variable "environment" { type = string }
variable "log_analytics_id" { type = string }
variable "vnet_id" { type = string }
variable "subnet_id" { type = string }
variable "cae_storage_account" {
  type    = map(string)
  default = {}
}
variable "tags" {
  type    = map(string)
  default = {}
}

locals {
  cae_name = "${var.name_prefix}-${var.environment}-cae"
}

module "avm-res-app-managedenvironment" {
  source                             = "Azure/avm-res-app-managedenvironment/azurerm"
  version                            = "0.3.0"
  location                           = var.location
  name                               = local.cae_name
  resource_group_name                = var.resource_group
  infrastructure_resource_group_name = var.resource_group
  infrastructure_subnet_id           = var.subnet_id
  log_analytics_workspace = {
    resource_id = var.log_analytics_id
  }
  managed_identities = {
    system_assigned = true
  }
  storages = {
    "default" = {
      access_key   = var.cae_storage_account.access_key
      access_mode  = var.cae_storage_account.access_mode
      account_name = var.cae_storage_account.account_name
      share_name   = var.cae_storage_account.share_name
    }
  }

  enable_telemetry        = true
  zone_redundancy_enabled = false
  tags                    = var.tags
}

output "id" { value = module.avm-res-app-managedenvironment.id }
output "default_domain" { value = module.avm-res-app-managedenvironment.default_domain }
