/*
module "ec2" {
  source = "./modules/ec2"

  ami_id        = "ami-0c9c942bd7bf113a2"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnets[0].id
  key_name      = aws_key_pair.key_pair.key_name
  security_group_ids = [
    aws_security_group.ec2_public_security_group.id
  ]

  user_data = file("./scripts/install-nginx.sh")

  common_tags = {
    Name = "test-instance"
  }
}
*/

resource "aws_instance" "client_instance1" {
  ami           = "ami-0c9c942bd7bf113a2"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnets[0].id
  key_name      = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [
    aws_security_group.ec2_public_security_group.id
  ]

  associate_public_ip_address = true

  user_data = file("./scripts/install-docker.sh")

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile Client Instance 1"
    }
  )
}

resource "aws_iam_role" "ec2_to_ecr_role" {
  name = "ec2_to_ecr_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": [
          "ec2.amazonaws.com"
        ]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
