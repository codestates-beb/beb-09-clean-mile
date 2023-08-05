module "ecr" {
  source = "./modules/ecr"

  for_each = var.ecr_repos

  name                 = each.value.name
  environment          = each.value.environment
  image_tag_mutability = each.value.image_tag_mutability
  scan_on_push         = each.value.scan_on_push
  common_tags          = var.common_tags
}

output "ecr_repo_names" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_name
  }
}

output "ecr_repo_arns" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_arn
  }
}

output "ecr_repo_registry_ids" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_registry_id
  }
}

output "ecr_repo_repository_url" {
  value = {
    for k, v in module.ecr : k => v.ecr_repo_repository_url
  }
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.s3_bucket_name
  tags   = var.common_tags
}

resource "aws_s3_bucket_public_access_block" "s3_bucket_public_access_block" {
  bucket = aws_s3_bucket.s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "s3_bucket_domain_name" {
  value = aws_s3_bucket.s3_bucket.bucket_domain_name
}
