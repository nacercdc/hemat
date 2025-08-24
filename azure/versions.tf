terraform {
  required_version = ">= 1.9,<2.0"

  # Configure remote state in Azure Storage
  #   backend "azurerm" {
  #     resource_group_name  = "your-resource-group-name"
  #     storage_account_name = "your-storage-account-name"
  #     container_name       = "your-container-name"
  #     key                  = "terraform.tfstate"
  #   }

  required_providers {
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    # modtm = {
    #   source  = "hashicorp/modtm"
    #   version = "~> 0.3"
    # }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}
