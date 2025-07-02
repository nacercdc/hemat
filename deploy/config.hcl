inputs = {
  common = {
    name = "africa-cdc-app"
    gitlab = "https://gitlab.com"
    gitlab_project_id = "70977352"
    repository = "africa-cdc"
    organization = "etmsoftware"
    registry_host = "docker.pkg.dev"
  }
  stg = {
    environment = "staging"
    project_id = "ethiochicken-test-459516"
    region = "us-west1"
  }
  prd = {
    environment = "production"
    project_id = "ethiochicken-test-459516"
    region = "us-west1"
  }
}
