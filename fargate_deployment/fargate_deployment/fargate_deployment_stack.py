import aws_cdk as cdk
from constructs import Construct
from aws_cdk import (
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecr as ecr,
)

class TrendWarsStack(cdk.Stack):
    def __init__(self, scope: Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Only public subnets (no NAT, no VPC endpoints)
        vpc = ec2.Vpc(self, "TrendWarsVPC",
            cidr="10.10.0.0/16",
            max_azs=2,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="public",
                    subnet_type=ec2.SubnetType.PUBLIC,
                    cidr_mask=24
                )
            ]
        )

        cluster = ecs.Cluster(self, "TrendWarsCluster", vpc=vpc)

        repository_name = "trend-wars-backend"
        repository = ecr.Repository.from_repository_name(self, "TrendWarsRepository", repository_name)

        task_definition = ecs.FargateTaskDefinition(self, "TaskDef",
            memory_limit_mib=512,
            cpu=256,
        )

        container = task_definition.add_container("TrendWarsContainer",
            image=ecs.ContainerImage.from_ecr_repository(repository),
            logging=ecs.LogDrivers.aws_logs(stream_prefix="TrendWars")
        )
        container.add_port_mappings(
            ecs.PortMapping(container_port=8000)
        )

        # allow inbound traffic on port 8000
        service_sg = ec2.SecurityGroup(self, "TrendWarsSecurityGroup",
            vpc=vpc,
            description="Allow inbound HTTP traffic on port 8000",
            allow_all_outbound=True
        )
        service_sg.add_ingress_rule(ec2.Peer.any_ipv4(), ec2.Port.tcp(8000), "Allow inbound traffic on port 8000")

        service = ecs.FargateService(self, "TrendWarsFargateService",
            cluster=cluster,
            task_definition=task_definition,
            desired_count=1,
            assign_public_ip=True,  
            security_groups=[service_sg],
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PUBLIC
            )
        )
