# variable "location" {
#   type    = string
#   default = "southafricanorth"
# }
variable "project_name" { type = string } # e.g. "hiemat"
variable "environment" { type = string }  # e.g. "dev", "prod"
variable "resource_tags" {
  type    = map(string)
  default = {}
}

# Existing "core" resources (already created)
variable "core_rg_name" {
  type    = string
  default = "rg-africacdc-infra"
}
variable "acr_name" {
  type    = string
  default = "africacdc"
}
variable "key_vault_name" {
  type    = string
  default = "africacdc-core-kv"
} # e.g. africacdc-kv

# container images (already built in CI and pushed to ACR)
variable "image_tag" { type = string } # commit SHA
