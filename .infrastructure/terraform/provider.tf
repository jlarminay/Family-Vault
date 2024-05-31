# Configure the DigitalOcean provider
terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    region                      = "us-west-1" // needed
    bucket                      = "larminay-vault-storage"
    key                         = "terraform.tfstate"
    endpoints = {
      s3 = "https://sfo2.digitaloceanspaces.com"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}
provider "cloudflare" {
  api_token = var.cf_api_token
  email     = var.cf_email
}
