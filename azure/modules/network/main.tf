variable "location" { type = string }
variable "project_name" { type = string }
variable "environment" { type = string }
variable "config" { type = object({
  resource_group               = string
  vnet_cidr                    = string
  subnet_cidr                  = string
  core_rg                      = string
  core_vnet                    = string
  kv_name                      = string
  acr_name                     = string
  log_analytics_workspace_name = string
  storage_account_name         = string
}) }

variable "tags" {
  type    = map(string)
  default = {}
}

# core VNet (existing)
data "azurerm_virtual_network" "core" {
  name                = var.config.core_vnet
  resource_group_name = var.config.core_rg
}

# -------- New Dev VNet + Subnet for CAE --------
resource "azurerm_virtual_network" "target_vnet" {
  name                = "${var.project_name}-${var.environment}-vnet"
  resource_group_name = var.config.resource_group
  location            = var.location
  address_space       = [var.config.vnet_cidr]
  tags                = var.tags
}

resource "azurerm_subnet" "cae_snet" {
  name                 = "${var.project_name}-${var.environment}-snet"
  resource_group_name  = var.config.resource_group
  virtual_network_name = azurerm_virtual_network.target_vnet.name
  address_prefixes     = [var.config.subnet_cidr]
}

# -------- VNet Peering (both directions) --------
resource "azurerm_virtual_network_peering" "dev_to_core" {
  name                         = "dev-to-core"
  resource_group_name          = var.config.resource_group
  virtual_network_name         = azurerm_virtual_network.target_vnet.name
  remote_virtual_network_id    = data.azurerm_virtual_network.core.id
  allow_forwarded_traffic      = true
  allow_virtual_network_access = true
}

# Requires permission on core RG to create:
resource "azurerm_virtual_network_peering" "core_to_dev" {
  name                         = "core-to-dev"
  resource_group_name          = var.config.core_rg
  virtual_network_name         = var.config.core_vnet
  remote_virtual_network_id    = azurerm_virtual_network.target_vnet.id
  allow_forwarded_traffic      = true
  allow_virtual_network_access = true
}

output "vnet_id" { value = azurerm_virtual_network.target_vnet.id }
output "vnet_name" { value = azurerm_virtual_network.target_vnet.name }
output "subnet_id" { value = azurerm_subnet.cae_snet.id }
output "subnet_name" { value = azurerm_subnet.cae_snet.name }
