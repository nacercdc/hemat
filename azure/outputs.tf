output "resource_group" { value = azurerm_resource_group.target_rg.name }
output "acr_login_server" { value = module.apps.login_server }
output "container_apps_domain" { value = module.cae.default_domain }
output "key_vault_uri" { value = module.apps.vault_uri }
output "postgres_fqdn" { value = module.apps.pg_fqdn }
output "storage_blob_endpoint" { value = module.apps.primary_blob_endpoint }

output "container_apps_environment_id" { value = module.cae.id }

output "web_fqdn" { value = module.apps.web_fqdn }
output "api_fqdn" { value = module.apps.api_fqdn }

output "log_analytics_workspace_id" { value = data.azurerm_log_analytics_workspace.core.id }
output "log_analytics_workspace_name" { value = data.azurerm_log_analytics_workspace.core.name }
