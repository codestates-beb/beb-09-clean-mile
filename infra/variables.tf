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
    environment          = string
    image_tag_mutability = string
    scan_on_push         = bool
  }))
  description = "ECR repositories to create"
  default = {
    "clean-mile-server" = {
      name                 = "clean-mile-server"
      environment          = "production"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
    }
    "clean-mile-client" = {
      name                 = "clean-mile-client"
      environment          = "production"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
    }
    "clean-mile-admin" = {
      name                 = "clean-mile-admin"
      environment          = "production"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
    }
    "clean-mile-daemon" = {
      name                 = "clean-mile-daemon"
      environment          = "production"
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
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