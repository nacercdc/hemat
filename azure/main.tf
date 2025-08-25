# This ensures we have unique CAF compliant names for our resources.
module "naming" {
  source  = "Azure/naming/azurerm"
  version = "0.4.0"
}
## variables
# project_name
# image_tag
# environment
# resource_tags
# core_rg_name
# environment
# key_vault_name

# -------- Lookup existing CORE resources --------
data "azurerm_resource_group" "core" {
  name = var.core_rg_name
}

data "azurerm_key_vault" "core" {
  name                = var.key_vault_name
  resource_group_name = data.azurerm_resource_group.core.name
}

data "azurerm_key_vault_secret" "tfconfig" {
  name         = "tf-config-${var.environment}"
  key_vault_id = data.azurerm_key_vault.core.id
}

locals {
  cfg      = jsondecode(data.azurerm_key_vault_secret.tfconfig.value)
  location = data.azurerm_resource_group.core.location

  project_rg = "${var.project_name}-${var.environment}-rg"
}

data "azurerm_log_analytics_workspace" "core" {
  name                = local.cfg.log_analytics_workspace_name
  resource_group_name = data.azurerm_resource_group.core.name
}

# -------- Resource Groups --------
resource "azurerm_resource_group" "target_rg" {
  name     = local.cfg.resource_group
  location = local.location
  tags     = var.resource_tags
}

# -------- Identity for apps --------
resource "azurerm_user_assigned_identity" "apps" {
  name                = "hemat-app-mi"
  resource_group_name = azurerm_resource_group.target_rg.name
  location            = local.location
  tags                = var.resource_tags
}

# -------- VNet + Subnet for CAE + peering --------
module "network" {
  source       = "./modules/network"
  location     = azurerm_resource_group.target_rg.location
  project_name = var.project_name
  environment  = var.environment
  config       = local.cfg
  tags         = var.resource_tags
}

# -------- Container Apps Environment (CAE) --------
module "cae" {
  source               = "./modules/container_apps_env"
  resource_group       = azurerm_resource_group.target_rg.name
  location             = azurerm_resource_group.target_rg.location
  project_name         = var.project_name
  environment          = var.environment
  log_analytics_id     = data.azurerm_log_analytics_workspace.core.id
  vnet_id              = module.network.vnet_id
  subnet_id            = module.network.subnet_id
  storage_account_name = local.cfg.storage_account_name
  core_rg              = data.azurerm_resource_group.core.name
  tags                 = var.resource_tags
}

module "apps" {
  source       = "./modules/apps"
  location     = azurerm_resource_group.target_rg.location
  project_name = var.project_name
  environment  = var.environment
  identity = {
    id           = azurerm_user_assigned_identity.apps.id
    principal_id = azurerm_user_assigned_identity.apps.principal_id
  }
  image_tag             = var.image_tag
  config                = local.cfg
  container_apps_env_id = module.cae.id
  tags                  = var.resource_tags
}
