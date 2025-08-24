variable "resource_group" { type = string }
variable "location" { type = string }
variable "environment" { type = string }
variable "project_name" { type = string }
variable "tags" {
  type    = map(string)
  default = {}
}

variable "container_apps_env_id" { type = string }
variable "core_infra" { type = object({
  acr_name             = string
  kv_name              = string
  pg_server_name       = string
  pg_database          = string
  storage_account_name = string
  rg_name              = string
  log_analytics_id     = string
}) }

variable "image_tag" { type = string }

data "azurerm_container_registry" "acr" {
  name                = var.core_infra.acr_name
  resource_group_name = var.core_infra.rg_name
}

data "azurerm_storage_account" "core" {
  name                = var.core_infra.storage_account_name
  resource_group_name = var.core_infra.rg_name
}

data "azurerm_key_vault" "core" {
  name                = var.core_infra.kv_name
  resource_group_name = var.core_infra.rg_name
}

# Flexible Server (existing)
data "azurerm_postgresql_flexible_server" "core" {
  name                = var.core_infra.pg_server_name
  resource_group_name = var.core_infra.rg_name
}

# -------- Identity for apps --------
resource "azurerm_user_assigned_identity" "apps" {
  name                = "hemat-app-mi"
  resource_group_name = var.resource_group
  location            = var.location
  tags                = var.tags
}

# -------- RBAC: allow images pull from ACR --------
resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

# -------- RBAC: Storage (create containers/blobs) --------
resource "azurerm_role_assignment" "app_storage_data" {
  scope                = data.azurerm_storage_account.core.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

# -------- RBAC: Key Vault (manage a single secret) --------
data "azurerm_subscription" "current" {}

# Resolve the built-in role at a subscription scope (works reliably)
data "azurerm_role_definition" "kv_secrets_user" {
  name  = "Key Vault Secrets User" # or "Key Vault Secrets Officer"
  scope = data.azurerm_subscription.current.id
}

# Scope the assignment to /secrets/<name> to limit to that secret only.
locals {
  secret_names = {
    postgres-url = "hemat-postgres-${var.environment}-url"
    redis-url    = "hemat-redis-${var.environment}-url"
    storage-url  = "hemat-blob-${var.environment}-url"
  }
  login_server = data.azurerm_container_registry.acr.login_server
  web_image    = "${local.login_server}/hemat-web:${var.image_tag}"
  api_image    = "${local.login_server}/hemat-api:${var.image_tag}"
  kv_uri       = trimsuffix(data.azurerm_key_vault.core.vault_uri, "/")
}

resource "azurerm_role_assignment" "app_kv_secret_mgr" {
  for_each           = local.secret_names
  scope              = "${data.azurerm_subscription.current.id}/resourcegroups/${var.core_infra.rg_name}/providers/Microsoft.KeyVault/vaults/${var.core_infra.kv_name}/secrets/${each.value}"
  role_definition_id = data.azurerm_role_definition.kv_secrets_user.id
  principal_id       = azurerm_user_assigned_identity.apps.principal_id
}

# -------- RBAC: PostgreSQL (control-plane to create DB) --------
resource "azurerm_role_assignment" "app_pg_contrib" {
  scope                = data.azurerm_postgresql_flexible_server.core.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.apps.principal_id
}

# Create DBs (requires Contributor role above)
resource "azurerm_postgresql_flexible_server_database" "database" {
  name      = var.core_infra.pg_database
  server_id = data.azurerm_postgresql_flexible_server.core.id
  charset   = "utf8"
  collation = "en_US.utf8"
}

# -------- Container Apps (web & api) --------
resource "azurerm_container_app" "web" {
  name                         = "hemat-web"
  resource_group_name          = var.resource_group
  container_app_environment_id = var.container_apps_env_id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.apps.id]
  }

  registry {
    server   = local.login_server
    identity = azurerm_user_assigned_identity.apps.id
  }

  # ---- Secrets (Key Vault–backed) ----
  # Postgres connection string
  secret {
    name                = "postgres-url"
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = "${local.kv_uri}/secrets/hemat-postgres-${var.environment}-url"
  }

  # Redis connection string
  secret {
    name                = "redis-url"
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = "${local.kv_uri}/secrets/hemat-redis-${var.environment}-url"
  }

  # Blob Storage (connection string) – optional if you use MSI/RBAC
  secret {
    name                = "storage-url"
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = "${local.kv_uri}/secrets/hemat-blob-${var.environment}-url"
  }

  template {
    container {
      name   = "web"
      image  = local.web_image
      cpu    = 1
      memory = "2Gi"
      # ports/env/secrets as needed

      # ---- Environment variables ----
      # Use secret values
      env {
        name        = "DATABASE_URL"
        secret_name = "postgres"
      }
      env {
        name        = "REDIS_URL"
        secret_name = "redis"
      }
      env {
        name        = "BLOB_CONNECTION_STRING" # if using connection string auth
        secret_name = "blob"
      }

      # Non-secret envs (safe values)
      env {
        name  = "KEY_VAULT_URI"
        value = data.azurerm_key_vault.core.vault_uri
      }
      env {
        name  = "BLOB_ACCOUNT" # for MSI/RBAC style
        value = data.azurerm_storage_account.core.name
      }
      env {
        name  = "BLOB_CONTAINER"
        value = "hemat-data-${var.environment}"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.app_storage_data,
    azurerm_role_assignment.app_kv_secret_mgr,
    azurerm_role_assignment.app_pg_contrib
  ]

  tags = var.tags
}

resource "azurerm_container_app" "api" {
  name                         = "hemat-api"
  resource_group_name          = var.resource_group
  container_app_environment_id = var.container_apps_env_id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.apps.id]
  }

  registry {
    server   = local.login_server
    identity = azurerm_user_assigned_identity.apps.id
  }

  # ---- Secrets (Key Vault–backed) ----
  # Postgres connection string
  secret {
    name                = "pg-url"
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = "${local.kv_uri}/secrets/hemat-postgres-url"
  }

  # Redis connection string
  secret {
    name                = "redis-url"
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = "${local.kv_uri}/secrets/hemat-redis-url"
  }

  # Blob Storage (connection string) – optional if you use MSI/RBAC
  secret {
    name                = "blob-conn"
    identity            = azurerm_user_assigned_identity.apps.id
    key_vault_secret_id = "${local.kv_uri}/secrets/hemat-blob-conn"
  }

  template {
    container {
      name   = "api"
      image  = local.api_image
      cpu    = 1
      memory = "2Gi"

      # ---- Environment variables ----
      # Use secret values
      env {
        name        = "DATABASE_URL"
        secret_name = "pg-url"
      }
      env {
        name        = "REDIS_URL"
        secret_name = "redis-url"
      }
      env {
        name        = "BLOB_CONNECTION_STRING" # if using connection string auth
        secret_name = "blob-conn"
      }

      # Non-secret envs (safe values)
      env {
        name  = "KEY_VAULT_URI"
        value = data.azurerm_key_vault.core.vault_uri
      }
      env {
        name  = "BLOB_ACCOUNT" # for MSI/RBAC style
        value = data.azurerm_storage_account.core.name
      }
      env {
        name  = "BLOB_CONTAINER"
        value = "hemat-data"
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 8080

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  depends_on = [
    azurerm_role_assignment.acr_pull,
    azurerm_role_assignment.app_storage_data,
    azurerm_role_assignment.app_kv_secret_mgr,
    azurerm_role_assignment.app_pg_contrib
  ]

  tags = var.tags
}

output "web_fqdn" { value = azurerm_container_app.web.latest_revision_fqdn }
output "api_fqdn" { value = azurerm_container_app.api.latest_revision_fqdn }
output "login_server" { value = data.azurerm_container_registry.acr.login_server }
output "vault_uri" { value = data.azurerm_key_vault.core.vault_uri }
output "pg_fqdn" { value = data.azurerm_postgresql_flexible_server.core.fqdn }
output "primary_blob_endpoint" { value = data.azurerm_storage_account.core.primary_blob_endpoint }
