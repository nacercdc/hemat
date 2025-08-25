variable "resource_group" { type = string }
variable "location" { type = string }
variable "project_name" { type = string }
variable "environment" { type = string }
variable "log_analytics_id" { type = string }
variable "vnet_id" { type = string }
variable "subnet_id" { type = string }
variable "storage_account_name" { type = string }
variable "core_rg" { type = string }
variable "tags" {
  type    = map(string)
  default = {}
}

data "azurerm_storage_account" "core" {
  name                = var.storage_account_name
  resource_group_name = var.core_rg
}

locals {
  cae_name = "${var.project_name}-${var.environment}-cae"
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
      access_key   = data.azurerm_storage_account.core.primary_access_key
      access_mode  = "ReadWrite"
      account_name = data.azurerm_storage_account.core.name
      share_name   = "${data.azurerm_storage_account.core.name}-${var.resource_group}-share"
    }
  }

  enable_telemetry        = true
  zone_redundancy_enabled = false
  tags                    = var.tags
}

output "id" { value = module.avm-res-app-managedenvironment.id }
output "default_domain" { value = module.avm-res-app-managedenvironment.default_domain }
