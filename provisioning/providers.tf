terraform {
  required_version = ">=1.3.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    local = ">=2.2.3"
  }
}

provider "aws" {
  region = "us-east-1"
}