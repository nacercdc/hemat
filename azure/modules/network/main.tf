variable "resource_group" { type = string }
variable "location" { type = string }
variable "project_name" { type = string }
variable "environment" { type = string }
variable "core_infra" { type = object({
  vnet_name = string
  rg_name   = string
}) }
variable "vnet" { type = object({
  name           = string
  address        = string
  subnet_address = string
}) }
variable "tags" {
  type    = map(string)
  default = {}
}

# core VNet (existing)
data "azurerm_virtual_network" "core" {
  name                = var.core_infra.vnet_name
  resource_group_name = var.core_infra.rg_name
}

# -------- New Dev VNet + Subnet for CAE --------
resource "azurerm_virtual_network" "target_vnet" {
  name                = "${var.project_name}-${var.environment}-vnet"
  resource_group_name = var.resource_group
  location            = var.location
  address_space       = [var.vnet.address]
  tags                = var.tags
}

resource "azurerm_subnet" "cae_snet" {
  name                 = "cae-snet"
  resource_group_name  = var.resource_group
  virtual_network_name = azurerm_virtual_network.target_vnet.name
  address_prefixes     = [var.vnet.subnet_address]
}

# -------- VNet Peering (both directions) --------
resource "azurerm_virtual_network_peering" "dev_to_core" {
  name                         = "dev-to-core"
  resource_group_name          = var.resource_group
  virtual_network_name         = azurerm_virtual_network.target_vnet.name
  remote_virtual_network_id    = data.azurerm_virtual_network.core.id
  allow_forwarded_traffic      = true
  allow_virtual_network_access = true
}

# Requires permission on core RG to create:
resource "azurerm_virtual_network_peering" "core_to_dev" {
  name                         = "core-to-dev"
  resource_group_name          = var.core_infra.rg_name
  virtual_network_name         = var.core_infra.vnet_name
  remote_virtual_network_id    = azurerm_virtual_network.target_vnet.id
  allow_forwarded_traffic      = true
  allow_virtual_network_access = true
}

output "vnet_id" { value = azurerm_virtual_network.target_vnet.id }
output "vnet_name" { value = azurerm_virtual_network.target_vnet.name }
output "subnet_id" { value = azurerm_subnet.cae_snet.id }
output "subnet_name" { value = azurerm_subnet.cae_snet.name }
