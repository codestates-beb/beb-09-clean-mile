resource "aws_launch_template" "client_template" {
  name          = "client-template"
  description   = "Template for client instances"
  image_id      = "ami-0c9c942bd7bf113a2"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.key_pair.key_name

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 15
      volume_type = "gp2"
    }
  }

  network_interfaces {
    associate_public_ip_address = true
    security_groups = [
      aws_security_group.client_security_group.id,
      aws_security_group.bastion_security_group.id,
    ]
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_to_ecr_instance_profile.name
  }

  user_data = filebase64("./scripts/setup-client.sh")

  tags = merge(
    var.common_tags,
    {
      "Name" = "Client Template"
    }
  )
}

resource "aws_launch_template" "server_template" {
  name          = "server-template"
  description   = "Template for server instances"
  image_id      = "ami-0c9c942bd7bf113a2"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [
    aws_security_group.server_security_group.id
  ]

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 15
      volume_type = "gp2"
    }
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_to_ecr_instance_profile.name
  }

  user_data = filebase64("./scripts/setup-server.sh")

  tags = merge(
    var.common_tags,
    {
      "Name" = "Server Template"
    }
  )
}

resource "aws_launch_template" "admin_template" {
  name          = "admin-template"
  description   = "Template for admin instances"
  image_id      = "ami-0c9c942bd7bf113a2"
  instance_type = "t3.micro"
  key_name      = aws_key_pair.key_pair.key_name

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 15
      volume_type = "gp2"
    }
  }

  network_interfaces {
    associate_public_ip_address = true
    security_groups = [
      aws_security_group.admin_security_group.id,
    ]
  }

  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_to_ecr_instance_profile.name
  }

  user_data = filebase64("./scripts/setup-admin.sh")

  tags = merge(
    var.common_tags,
    {
      "Name" = "Admin Template"
    }
  )
}
