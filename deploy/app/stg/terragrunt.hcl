locals {
  config = read_terragrunt_config("../../config.hcl").inputs
  env    = basename(get_terragrunt_dir())
}

inputs = merge(local.config.common, local.config[local.env])

terraform {
  source = ".."
}

remote_state {
  backend = "gcs"
  config = {
    bucket = "${local.config.common.name}-terraform-tfstate"
    prefix = "terraform.tfstate"
    project = local.config[local.env].project_id
  }
}