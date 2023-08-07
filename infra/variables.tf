variable "common_tags" {
  type        = map(string)
  description = "Common tags to apply to all resources"
  default = {
    "Project" = "Clean Mile"
  }
}

variable "ecr_repos" {
  type = map(object({
    name                 = string
    image_tag_mutability = string
    scan_on_push         = bool
    name_tag             = string
  }))
  description = "ECR repositories to create"
  default = {
    "clean-mile-server" = {
      name                 = "clean-mile-server"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
      name_tag             = "Clean Mile Server"
    }
    "clean-mile-client" = {
      name                 = "clean-mile-client"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
      name_tag             = "Clean Mile Client"
    }
    "clean-mile-admin" = {
      name                 = "clean-mile-admin"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
      name_tag             = "Clean Mile Admin"
    }
    "clean-mile-daemon" = {
      name                 = "clean-mile-daemon"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
      name_tag             = "Clean Mile Daemon"
    }
  }
}

variable "s3_bucket_name" {
  type        = string
  description = "Name of the S3 bucket to create"
  default     = "clean-mile"
}

variable "key_pair_name" {
  type        = string
  description = "Name of the key pair to create"
  default     = "clean-mile-key-pair"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for the public subnets"
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for the private subnets"
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability zones to use for the subnets"
  default     = ["ap-northeast-2a", "ap-northeast-2b"]
}

variable "domain_name" {
  type        = string
  description = "Domain name for the hosted zone"
  default     = "clean-mile.co"
}

variable "manager_ip" {
  type        = string
  description = "IP address of the manager"
}
