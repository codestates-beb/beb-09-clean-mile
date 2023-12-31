module "ecr" {
  source = "./modules/ecr"

  for_each = var.ecr_repos

  name                 = each.value.name
  image_tag_mutability = each.value.image_tag_mutability
  scan_on_push         = each.value.scan_on_push
  common_tags          = merge(var.common_tags,
    {
      "Name" = "${each.value.name_tag} ECR"
    }
  )
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
