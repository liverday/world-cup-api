terraform {
  required_version = ">=1.3.4"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    local = ">=2.2.3"
  }

  backend "s3" {
    profile    = "default"
    region     = "us-east-1"
    key        = "terraform.tfstate"
    encrypt    = true
    kms_key_id = "alias/production-terraform-state"
  }
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

module "vpc" {
  source      = "../modules/vpc"
  environment = var.environment
}

module "database" {
  source         = "../modules/database"
  environment    = var.environment
  vpc_id         = module.vpc.vpc_id
  vpc_cidr_block = module.vpc.vpc_cidr_block
  route_table_id = module.vpc.route_table_id

  engine_version           = "12.12"
  instance_class           = "db.t2.micro"
  allocated_storage        = 20
  max_allocated_storage    = 20
  backup_retention_period  = 0
  skip_final_snapshot      = true
  deletion_protection      = false
  delete_automated_backups = true
}

