
import aws_cdk as cdk
from constructs import Construct
from aws_cdk import (
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecr as ecr,
    aws_ecs_patterns as ecs_patterns,
)

class TrendWarsStack(cdk.Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Farget needs a VPC I guess
        vpc = ec2.Vpc(self, "TrendWarsVPC", max_azs=2)

        # ECS cluster to run container
        cluster = ecs.Cluster(self, "TrendWarsCluster", vpc=vpc)

        # ECR Repository for storing Docker images (must already exist)
        repository_name = "trend-wars-backend"
        repository = ecr.Repository.from_repository_name(self, "TrendWarsRepository", repository_name)


        ecs_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self, "TrendWarsFargateService",
            cluster=cluster,
            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=ecs.ContainerImage.from_ecr_repository(repository),
                container_port=8000
            ),
            public_load_balancer=True  
        )

        # Set ALB to check /health
        ecs_service.target_group.configure_health_check(
            path="/health",  # Make sure this matches the endpoint
            interval=cdk.Duration.seconds(30),
            timeout=cdk.Duration.seconds(5),
            unhealthy_threshold_count=2,
            healthy_threshold_count=2,
        )

        # Note that this won't auto-update on a new image push. I might do that later via an ECS task def.