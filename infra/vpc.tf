resource "aws_vpc" "main_vpc" {
  cidr_block = var.vpc_cidr

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile VPC"
    }
  )
}

resource "aws_subnet" "public_subnets" {
  count             = length(var.public_subnet_cidrs)
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Public Subnet ${count.index + 1}"
    }
  )
}

resource "aws_subnet" "private_subnets" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Private Subnet ${count.index + 1}"
    }
  )
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_internet_gateway.id
  }

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Public Route Table"
    }
  )
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Private Route Table"
    }
  )
}

resource "aws_route_table_association" "public_route_table_associations" {
  count          = length(var.public_subnet_cidrs)
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "private_route_table_associations" {
  count          = length(var.private_subnet_cidrs)
  subnet_id      = aws_subnet.private_subnets[count.index].id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_internet_gateway" "main_internet_gateway" {
  vpc_id = aws_vpc.main_vpc.id

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile Internet Gateway"
    }
  )
}

resource "aws_eip" "nat_eip" {
  domain = "vpc"

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile NAT EIP"
    }
  )
}

resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnets[0].id

  tags = merge(
    var.common_tags,
    {
      Name = "Clean Mile NAT Gateway"
    }
  )
}

resource "aws_route" "private_nat_route" {
  route_table_id         = aws_route_table.private_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat_gateway.id
}

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
