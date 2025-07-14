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
    bucket  = "${local.config.common.project_name}-terraform-tfstate"
    prefix  = "${local.config.common.project_name}.meta.${local.env}"
    project = local.config[local.env].project_id
  }
}