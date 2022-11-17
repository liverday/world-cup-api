output "registry_id" {
  value = aws_ecr_repository.ecr_repo.registry_id
}

output "repository_url" {
  value = aws_ecr_repository.ecr_repo.repository_url
}
