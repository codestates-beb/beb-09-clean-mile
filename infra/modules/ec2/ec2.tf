resource "aws_instance" "ec2_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  vpc_security_group_ids = var.security_group_ids
  subnet_id              = var.subnet_id
  key_name               = var.key_name

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = var.root_volume_type
    tags = merge(
      var.common_tags,
      {
        Name = "Clean Mile EC2 Instance Root Volume"
      }
    )
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile EC2 Instance"
    }
  )
}
