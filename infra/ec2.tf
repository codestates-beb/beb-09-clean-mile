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
