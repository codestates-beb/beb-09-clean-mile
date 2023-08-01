module "ecr" {
  source = "./modules/ecr"

  name                 = "clean-mile-ecr"
  environment          = "dev"
  image_tag_mutability = "IMMUTABLE"
  scan_on_push         = true
  common_tags          = var.common_tags
}

output "ecr_repo_name" {
  value = module.ecr.ecr_repo_name
}

output "ecr_repo_arn" {
  value = module.ecr.ecr_repo_arn
}

output "ecr_repo_registry_id" {
  value = module.ecr.ecr_repo_registry_id
}

output "ecr_repo_repository_url" {
  value = module.ecr.ecr_repo_repository_url
}
