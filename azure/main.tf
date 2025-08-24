# This ensures we have unique CAF compliant names for our resources.
module "naming" {
  source  = "Azure/naming/azurerm"
  version = "0.4.0"
}

locals {
  project_rg = "${var.project_name}-${var.environment}-rg"
}

# -------- Lookup existing CORE resources --------
data "azurerm_resource_group" "core" {
  name = var.core_rg_name
}

data "azurerm_log_analytics_workspace" "core" {
  name                = var.log_analytics_workspace_name
  resource_group_name = var.core_rg_name
}

data "azurerm_storage_account" "core" {
  name                = var.storage_account_name
  resource_group_name = var.core_rg_name
}

# -------- Resource Groups --------
resource "azurerm_resource_group" "target_rg" {
  name     = local.project_rg
  location = var.location
}

# -------- VNet + Subnet for CAE + peering --------
module "network" {
  source         = "./modules/network"
  resource_group = azurerm_resource_group.target_rg.name
  location       = azurerm_resource_group.target_rg.location
  project_name   = var.project_name
  environment    = var.environment
  core_infra = {
    vnet_name = var.core_vnet_name
    rg_name   = var.core_rg_name
  }
  vnet = {
    name           = "${var.project_name}-${var.environment}-vnet"
    address        = var.target_vnet_cidr
    subnet_address = var.cae_subnet_cidr
  }
  tags = var.resource_tags
}

# -------- Container Apps Environment (CAE) --------
module "cae" {
  source           = "./modules/container_apps_env"
  resource_group   = azurerm_resource_group.target_rg.name
  location         = azurerm_resource_group.target_rg.location
  name_prefix      = var.project_name
  environment      = var.environment
  log_analytics_id = data.azurerm_log_analytics_workspace.core.id
  vnet_id          = module.network.vnet_id
  subnet_id        = module.network.subnet_id
  cae_storage_account = {
    access_key   = data.azurerm_storage_account.core.primary_access_key
    access_mode  = "ReadWrite"
    account_name = data.azurerm_storage_account.core.name
    share_name   = "${data.azurerm_storage_account.core.name}-${local.project_rg}-share"
  }
  tags = var.resource_tags
}

module "apps" {
  source         = "./modules/apps"
  resource_group = azurerm_resource_group.target_rg.name
  location       = azurerm_resource_group.target_rg.location
  project_name   = var.project_name
  environment    = var.environment
  image_tag      = var.image_tag
  core_infra = {
    acr_name             = var.acr_name
    kv_name              = var.key_vault_name
    pg_server_name       = var.pg_server_name
    pg_database          = var.postgres_database
    storage_account_name = var.storage_account_name
    rg_name              = var.core_rg_name
    log_analytics_id     = data.azurerm_log_analytics_workspace.core.id
  }
  container_apps_env_id = module.cae.id
  tags                  = var.resource_tags
}
