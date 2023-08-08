resource "aws_instance" "client_instance1" {
  ami           = "ami-0c9c942bd7bf113a2"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public_subnets[0].id
  key_name      = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [
    aws_security_group.bastion_security_group.id,
    aws_security_group.client_security_group.id
  ]
  iam_instance_profile = aws_iam_instance_profile.ec2_to_ecr_instance_profile.name

  associate_public_ip_address = true

  user_data = file("./scripts/install-docker.sh")

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile Client Instance 1"
    }
  )
}


resource "aws_instance" "server_instance1" {
  ami           = "ami-0c9c942bd7bf113a2"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.private_subnets[0].id
  key_name      = aws_key_pair.key_pair.key_name
  vpc_security_group_ids = [
    aws_security_group.server_security_group.id
  ]
  iam_instance_profile = aws_iam_instance_profile.ec2_to_ecr_instance_profile.name

  user_data = file("./scripts/install-docker.sh")

  tags = merge(
    var.common_tags,
    {
      "Name" = "Clean Mile Server Instance 1"
    }
  )
}
