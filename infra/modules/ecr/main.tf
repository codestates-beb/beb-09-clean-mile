resource "aws_ecr_repository" "ecr_repo" {
  name                 = var.name
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  tags = merge(
    var.common_tags,
    {
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  )
}

resource "aws_ecr_lifecycle_policy" "ecr_repo_policy" {
  repository = aws_ecr_repository.ecr_repo.name
  policy     = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expire images older than 14 days",
            "selection": {
                "tagStatus": "untagged",
                "countType": "sinceImagePushed",
                "countUnit": "days",
                "countNumber": 14
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}

output "ecr_repo_name" {
  value = aws_ecr_repository.ecr_repo.name
}

output "ecr_repo_arn" {
  value = aws_ecr_repository.ecr_repo.arn
}

output "ecr_repo_registry_id" {
  value = aws_ecr_repository.ecr_repo.registry_id
}

output "ecr_repo_repository_url" {
  value = aws_ecr_repository.ecr_repo.repository_url
}
