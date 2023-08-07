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