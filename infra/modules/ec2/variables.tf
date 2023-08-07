variable "ami_id" {
  type        = string
  description = "AMI ID to use for the EC2 instance"
  default     = null
}

variable "instance_type" {
  type        = string
  description = "Instance type to use for the EC2 instance"
  default     = "t2.micro"
}

variable "security_group_ids" {
  type        = list(string)
  description = "List of security group IDs to attach to the EC2 instance"
  default     = []
}

variable "subnet_id" {
  type        = string
  description = "Subnet ID to use for the EC2 instance"
  default     = null
}

variable "key_name" {
  type        = string
  description = "SSH key name to use for the EC2 instance"
  default     = null
}

variable "root_volume_size" {
  type        = number
  description = "Root volume size in GB"
  default     = 8
}

variable "root_volume_type" {
  type        = string
  description = "Root volume type"
  default     = "gp2"
}

variable "common_tags" {
  type        = map(string)
  description = "Common tags to apply to all resources"
  default     = {}
}

variable "user_data" {
  type        = string
  description = "User data to pass to the EC2 instance"
  default     = null
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "dev"
}
