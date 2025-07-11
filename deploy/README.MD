# Google Cloud Workload Identity Federation Setup for GitHub Actions

This guide explains how to install the Google Cloud CLI, create a service account, and assign nessary roles to the service account.

---

## 1. Install Google Cloud CLI

```sh
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xf google-cloud-cli-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh
source ~/.bashrc
gcloud init
```

---

## 2. Set Environment Variables

Replace the values below as needed for your environment.

```sh
export PROJECT_NAME=africa-cdc
export REGION=us-west1
export PROJECT_ID=ethiochicken-test-459516
export SERVICE_ACCOUNT_NAME="terraform"
export DISPLAY_NAME="Terraform Service Account"
export SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
```

---

## 3. Auth to Google

```sh
gcloud auth login
gcloud config set project "${PROJECT_ID}"
```

---

## 4. Create Service Account

```sh
gcloud iam service-accounts create "${SERVICE_ACCOUNT_NAME}" --display-name "${DISPLAY_NAME}"
```

---

## 5. Assign necessary Roles for Terraform Aervice Account

```sh
ROLES=(
  "roles/iam.serviceAccountCreator"
  "roles/iam.workloadIdentityPoolAdmin"
  "roles/iam.serviceAccountAdmin"
  "roles/secretmanager.admin"
  "roles/resourcemanager.projectIamAdmin"
  "roles/compute.networkAdmin"
  "roles/vpcaccess.admin"
  "roles/cloudsql.admin"
  "roles/storage.admin"
  "roles/artifactregistry.admin"
  "roles/iam.serviceAccountTokenCreator"
  "roles/run.admin"
  "roles/iam.serviceAccountUser"
)

for ROLE in "${ROLES[@]}"; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member "serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role "${ROLE}"
done
```

---

## 6. Create a bucket for terraform backend

```sh
gcloud storage buckets create gs://${PROJECT_NAME}-terraform-tfstate \
  --location=${REGION} \
  --uniform-bucket-level-access \
  --public-access-prevention
```

**Notes:**
- Replace all variable values as appropriate for your GCP project and GitHub repository.
- Make sure you have the required permissions in GCP to perform these operations.
- For more details, see the [official GCP documentation](https://cloud.google.com/iam/docs/workload-identity-federation).