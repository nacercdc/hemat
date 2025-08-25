variable "location" { type = string }
variable "environment" { type = string }
variable "project_name" { type = string }
variable "identity" { type = object({
  principal_id = string
  id           = string
}) }
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

variable "container_apps_env_id" { type = string }

variable "image_tag" { type = string }

data "azurerm_container_registry" "acr" {
  name                = var.config.acr_name
  resource_group_name = var.config.core_rg
}

data "azurerm_key_vault" "core" {
  name                = var.config.kv_name
  resource_group_name = var.config.core_rg
}

# -------- RBAC: allow images pull from ACR --------
resource "azurerm_role_assignment" "acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = var.identity.principal_id
}

# -------- RBAC: Key Vault  --------
data "azurerm_subscription" "current" {}

# Resolve the built-in role at a subscription scope (works reliably)
data "azurerm_role_definition" "kv_secrets_user" {
  name  = "Key Vault Secrets User" # or "Key Vault Secrets Officer"
  scope = data.azurerm_subscription.current.id
}

# Find secrets (ARM resources) in that RG/Vault with the required tags
data "azurerm_resources" "kv_secrets" {
  type                = "Microsoft.KeyVault/vaults/secrets"
  resource_group_name = var.config.core_rg
  required_tags       = { "app" = "hiemat" }
}

# Scope the assignment to /secrets/<name> to limit to these secrets only.
locals {
  login_server = data.azurerm_container_registry.acr.login_server
  web_image    = "${local.login_server}/hemat-web:${var.image_tag}"
  api_image    = "${local.login_server}/hemat-api:${var.image_tag}"
  kv_uri       = trimsuffix(data.azurerm_key_vault.core.vault_uri, "/")

  # Turn the list of resources into a map keyed by ENV var name
  kv_env_secrets = {
    for r in data.azurerm_resources.kv_secrets.resources :
    lookup(r.tags, "env", replace(element(split("/", r.id), length(split("/", r.id)) - 1), "-", "_")) => {
      secret_name = element(split("/", r.id), length(split("/", r.id)) - 1)                              # pure KV secret name
      arm_id      = r.id                                                                                 # ARM id of the secret
      uri         = "${local.kv_uri}/secrets/${element(split("/", r.id), length(split("/", r.id)) - 1)}" # versionless KV URI
    }
  }
}

resource "azurerm_role_assignment" "app_kv_read" {
  scope              = data.azurerm_key_vault.core.id # secret ARM id
  role_definition_id = data.azurerm_role_definition.kv_secrets_user.id
  principal_id       = var.identity.principal_id
}

# -------- Container Apps (web & api) --------
resource "azurerm_container_app" "web" {
  name                         = "hemat-web"
  resource_group_name          = var.config.resource_group
  container_app_environment_id = var.container_apps_env_id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity.id]
  }

  registry {
    server   = local.login_server
    identity = var.identity.id
  }

  # ---- Secrets (Key Vault–backed) ----

  secret {
    name                = "hemat-admin-email"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-ADMIN-EMAIL"
  }

  secret {
    name                = "hemat-admin-password"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-ADMIN-PASSWORD"
  }

  secret {
    name                = "hemat-database-host"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-HOST"
  }

  secret {
    name                = "hemat-database-name"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-NAME"
  }

  secret {
    name                = "hemat-database-password"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-PASSWORD"
  }

  secret {
    name                = "hemat-database-port"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-PORT"
  }

  secret {
    name                = "hemat-database-url"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-URL"
  }

  secret {
    name                = "hemat-database-username"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-USERNAME"
  }

  secret {
    name                = "hemat-redis-db"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-DB"
  }

  secret {
    name                = "hemat-redis-host"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-HOST"
  }

  secret {
    name                = "hemat-redis-password"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-PASSWORD"
  }

  secret {
    name                = "hemat-redis-port"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-PORT"
  }

  secret {
    name                = "hemat-redis-ssl"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-SSL"
  }

  secret {
    name                = "hemat-smtp-from"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-FROM"
  }

  secret {
    name                = "hemat-smtp-host"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-HOST"
  }

  secret {
    name                = "hemat-smtp-pass"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-PASS"
  }

  secret {
    name                = "hemat-smtp-port"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-PORT"
  }

  secret {
    name                = "hemat-smtp-user"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-USER"
  }

  secret {
    name                = "hemat-storage-account"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ACCOUNT"
  }

  secret {
    name                = "hemat-storage-account-container"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ACCOUNT-CONTAINER"
  }

  secret {
    name                = "hemat-storage-account-key"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ACCOUNT-KEY"
  }

  secret {
    name                = "hemat-storage-connection"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-CONNECTION"
  }

  secret {
    name                = "hemat-storage-endpoint"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ENDPOINT"
  }
  secret {
    name                = "hemat-auth-jwt-secret"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-AUTH-JWT-SECRET"
  }
  secret {
    name                = "hemat-auth-refresh-secret"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-AUTH-REFRESH-SECRET"
  }

  template {
    container {
      name   = "web"
      image  = local.web_image
      cpu    = 1
      memory = "2Gi"
      # ports/env/secrets as needed

      # ---- Environment variables ----
      env {
        name  = "KEY_VAULT_URI"
        value = data.azurerm_key_vault.core.vault_uri
      }

      env {
        name        = "ADMIN_EMAIL"
        secret_name = "hemat-admin-email"
      }

      env {
        name        = "ADMIN_PASSWORD"
        secret_name = "hemat-admin-password"
      }

      env {
        name        = "DATABASE_HOST"
        secret_name = "hemat-database-host"
      }

      env {
        name        = "DATABASE_NAME"
        secret_name = "hemat-database-name"
      }

      env {
        name        = "DATABASE_PASSWORD"
        secret_name = "hemat-database-password"
      }

      env {
        name        = "DATABASE_PORT"
        secret_name = "hemat-database-port"
      }

      env {
        name        = "DATABASE_URL"
        secret_name = "hemat-database-url"
      }

      env {
        name        = "DATABASE_USERNAME"
        secret_name = "hemat-database-username"
      }

      env {
        name        = "REDIS_DB"
        secret_name = "hemat-redis-db"
      }

      env {
        name        = "REDIS_HOST"
        secret_name = "hemat-redis-host"
      }

      env {
        name        = "REDIS_PASSWORD"
        secret_name = "hemat-redis-password"
      }

      env {
        name        = "REDIS_PORT"
        secret_name = "hemat-redis-port"
      }

      env {
        name        = "REDIS_SSL"
        secret_name = "hemat-redis-ssl"
      }

      env {
        name        = "SMTP_FROM"
        secret_name = "hemat-smtp-from"
      }

      env {
        name        = "SMTP_HOST"
        secret_name = "hemat-smtp-host"
      }

      env {
        name        = "SMTP_PASS"
        secret_name = "hemat-smtp-pass"
      }

      env {
        name        = "SMTP_PORT"
        secret_name = "hemat-smtp-port"
      }

      env {
        name        = "SMTP_USER"
        secret_name = "hemat-smtp-user"
      }

      env {
        name        = "STORAGE_ACCOUNT"
        secret_name = "hemat-storage-account"
      }

      env {
        name        = "STORAGE_ACCOUNT_CONTAINER"
        secret_name = "hemat-storage-account-container"
      }

      env {
        name        = "STORAGE_ACCOUNT_KEY"
        secret_name = "hemat-storage-account-key"
      }

      env {
        name        = "STORAGE_CONNECTION"
        secret_name = "hemat-storage-connection"
      }

      env {
        name        = "STORAGE_ENDPOINT"
        secret_name = "hemat-storage-endpoint"
      }
      env {
        name        = "AUTH_JWT_SECRET"
        secret_name = "hemat-auth-jwt-secret"
      }
      env {
        name        = "AUTH_REFRESH_SECRET"
        secret_name = "hemat-auth-refresh-secret"
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
    azurerm_role_assignment.app_kv_read,
  ]

  tags = var.tags
}

resource "azurerm_container_app" "api" {
  name                         = "hemat-api"
  resource_group_name          = var.config.resource_group
  container_app_environment_id = var.container_apps_env_id
  revision_mode                = "Single"

  identity {
    type         = "UserAssigned"
    identity_ids = [var.identity.id]
  }

  registry {
    server   = local.login_server
    identity = var.identity.id
  }

  # ---- Secrets (Key Vault–backed) ----

  secret {
    name                = "hemat-admin-email"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-ADMIN-EMAIL"
  }

  secret {
    name                = "hemat-admin-password"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-ADMIN-PASSWORD"
  }

  secret {
    name                = "hemat-database-host"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-HOST"
  }

  secret {
    name                = "hemat-database-name"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-NAME"
  }

  secret {
    name                = "hemat-database-password"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-PASSWORD"
  }

  secret {
    name                = "hemat-database-port"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-PORT"
  }

  secret {
    name                = "hemat-database-url"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-URL"
  }

  secret {
    name                = "hemat-database-username"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-DATABASE-USERNAME"
  }

  secret {
    name                = "hemat-redis-db"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-DB"
  }

  secret {
    name                = "hemat-redis-host"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-HOST"
  }

  secret {
    name                = "hemat-redis-password"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-PASSWORD"
  }

  secret {
    name                = "hemat-redis-port"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-PORT"
  }

  secret {
    name                = "hemat-redis-ssl"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-REDIS-SSL"
  }

  secret {
    name                = "hemat-smtp-from"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-FROM"
  }

  secret {
    name                = "hemat-smtp-host"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-HOST"
  }

  secret {
    name                = "hemat-smtp-pass"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-PASS"
  }

  secret {
    name                = "hemat-smtp-port"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-PORT"
  }

  secret {
    name                = "hemat-smtp-user"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-SMTP-USER"
  }

  secret {
    name                = "hemat-storage-account"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ACCOUNT"
  }

  secret {
    name                = "hemat-storage-account-container"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ACCOUNT-CONTAINER"
  }

  secret {
    name                = "hemat-storage-account-key"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ACCOUNT-KEY"
  }

  secret {
    name                = "hemat-storage-connection"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-CONNECTION"
  }

  secret {
    name                = "hemat-storage-endpoint"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-STORAGE-ENDPOINT"
  }
  secret {
    name                = "hemat-auth-jwt-secret"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-AUTH-JWT-SECRET"
  }
  secret {
    name                = "hemat-auth-refresh-secret"
    identity            = var.identity.id
    key_vault_secret_id = "${local.kv_uri}/secrets/HEMAT-AUTH-REFRESH-SECRET"
  }

  template {
    container {
      name   = "api"
      image  = local.api_image
      cpu    = 1
      memory = "2Gi"

      # ---- Environment variables ----
      env {
        name        = "ADMIN_EMAIL"
        secret_name = "hemat-admin-email"
      }

      env {
        name        = "ADMIN_PASSWORD"
        secret_name = "hemat-admin-password"
      }

      env {
        name        = "DATABASE_HOST"
        secret_name = "hemat-database-host"
      }

      env {
        name        = "DATABASE_NAME"
        secret_name = "hemat-database-name"
      }

      env {
        name        = "DATABASE_PASSWORD"
        secret_name = "hemat-database-password"
      }

      env {
        name        = "DATABASE_PORT"
        secret_name = "hemat-database-port"
      }

      env {
        name        = "DATABASE_URL"
        secret_name = "hemat-database-url"
      }

      env {
        name        = "DATABASE_USERNAME"
        secret_name = "hemat-database-username"
      }

      env {
        name        = "REDIS_DB"
        secret_name = "hemat-redis-db"
      }

      env {
        name        = "REDIS_HOST"
        secret_name = "hemat-redis-host"
      }

      env {
        name        = "REDIS_PASSWORD"
        secret_name = "hemat-redis-password"
      }

      env {
        name        = "REDIS_PORT"
        secret_name = "hemat-redis-port"
      }

      env {
        name        = "REDIS_SSL"
        secret_name = "hemat-redis-ssl"
      }

      env {
        name        = "SMTP_FROM"
        secret_name = "hemat-smtp-from"
      }

      env {
        name        = "SMTP_HOST"
        secret_name = "hemat-smtp-host"
      }

      env {
        name        = "SMTP_PASS"
        secret_name = "hemat-smtp-pass"
      }

      env {
        name        = "SMTP_PORT"
        secret_name = "hemat-smtp-port"
      }

      env {
        name        = "SMTP_USER"
        secret_name = "hemat-smtp-user"
      }

      env {
        name        = "STORAGE_ACCOUNT"
        secret_name = "hemat-storage-account"
      }

      env {
        name        = "STORAGE_ACCOUNT_CONTAINER"
        secret_name = "hemat-storage-account-container"
      }

      env {
        name        = "STORAGE_ACCOUNT_KEY"
        secret_name = "hemat-storage-account-key"
      }

      env {
        name        = "STORAGE_CONNECTION"
        secret_name = "hemat-storage-connection"
      }

      env {
        name        = "STORAGE_ENDPOINT"
        secret_name = "hemat-storage-endpoint"
      }
      env {
        name        = "AUTH_JWT_SECRET"
        secret_name = "hemat-auth-jwt-secret"
      }
      env {
        name        = "AUTH_REFRESH_SECRET"
        secret_name = "hemat-auth-refresh-secret"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "APP_NAME"
        value = "HIEMAT"
      }
      env {
        name  = "APP_VERSION"
        value = "1.0"
      }
      env {
        name  = "APP_PORT"
        value = "8080"
      }
      env {
        name  = "API_PREFIX"
        value = "api"
      }
      env {
        name  = "APP_FALLBACK_LANGUAGE"
        value = "en"
      }
      env {
        name  = "APP_HEADER_LANGUAGE"
        value = "x-custom-lang"
      }
      env {
        name  = "THROTTLE_TTL"
        value = "6000"
      }
      env {
        name  = "THROTTLE_LIMIT"
        value = "10"
      }
      env {
        name  = "THROTTLE_BLOCK_DURATION"
        value = "3600"
      }
      env {
        name  = "FRONTEND_DOMAIN"
        value = "http://localhost:3000"
      }
      env {
        name  = "BACKEND_DOMAIN"
        value = "http://localhost:8080"
      }

      # Database
      env {
        name  = "DATABASE_TYPE"
        value = "postgres"
      }
      env {
        name  = "DATABASE_MAX_CONNECTIONS"
        value = "100"
      }
      env {
        name  = "DATABASE_REJECT_UNAUTHORIZED"
        value = "false"
      }

      # Auth
      env {
        name  = "AUTH_JWT_TOKEN_EXPIRES_IN"
        value = "24hr"
      }
      env {
        name  = "AUTH_REFRESH_TOKEN_EXPIRES_IN"
        value = "365d"
      }
      env {
        name  = "AUTH_FORGOT_TOKEN_EXPIRES_IN"
        value = "15"
      }
      env {
        name  = "AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN"
        value = "15"
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
    azurerm_role_assignment.app_kv_read,
  ]

  tags = var.tags
}

output "web_fqdn" { value = azurerm_container_app.web.latest_revision_fqdn }
output "api_fqdn" { value = azurerm_container_app.api.latest_revision_fqdn }
output "login_server" { value = data.azurerm_container_registry.acr.login_server }
output "vault_uri" { value = data.azurerm_key_vault.core.vault_uri }
