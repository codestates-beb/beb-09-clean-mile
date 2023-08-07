resource "aws_security_group" "main_public_security_group" {
  name        = "Clean Mile Public Security Group"
  description = "Clean Mile Public Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow http inbound traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow https inbound traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Public Security Group"
    }
  )
}

resource "aws_security_group" "ec2_private_security_group" {
  name        = "Clean Mile EC2 Private Security Group"
  description = "Clean Mile EC2 Private Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description     = "Allow SSH inbound traffic"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.main_public_security_group.id]
  }

  ingress {
    description     = "Allow HTTP inbound traffic from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.main_public_security_group.id]
  }

  ingress {
    description     = "Allow HTTPS inbound traffic from ALB"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.main_public_security_group.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile EC2 Private Security Group"
    }
  )
}

resource "aws_security_group" "ec2_public_security_group" {
  name        = "Clean Mile EC2 Public Security Group"
  description = "Clean Mile EC2 Public Security Group"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    description = "Allow SSH inbound traffic"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.manager_ip]
  }

  ingress {
    description = "Allow HTTP inbound traffic from ALB"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS inbound traffic from ALB"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile EC2 Public Security Group"
    }
  )
}
