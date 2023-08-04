variable "name" {
  type        = string
  description = "Name of the ECR repository (Required)"
  default     = null
}

variable "image_tag_mutability" {
  type        = string
  description = "The tag mutability setting for the repository. Must be one of: MUTABLE or IMMUTABLE"
  default     = "MUTABLE"

}

variable "scan_on_push" {
  type        = bool
  description = "Indicates whether images are scanned after being pushed to the repository (true/false)"
  default     = true
}

variable "common_tags" {
  type        = map(string)
  description = "Common tags to apply to all resources"
  default     = {}
}

variable "environment" {
  type        = string
  description = "Environment name"
  default     = "dev"
}
