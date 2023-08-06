resource "aws_instance" "ec2_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.subnet_id
  key_name               = var.key_name

  user_data = var.user_data != null ? var.user_data : null

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = var.root_volume_type
    tags = merge(
      var.common_tags,
      {
        ManagedBy   = "Terraform"
        Environment = var.environment
      }
    )
  }

  tags = merge(
    var.common_tags,
    {
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  )
}
