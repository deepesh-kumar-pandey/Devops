from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "devops_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)


@celery_app.task(name="run_pipeline")
def run_pipeline(pipeline_id: int, run_id: int):
    """Execute a pipeline run"""
    # This would contain the actual pipeline execution logic
    print(f"Running pipeline {pipeline_id}, run {run_id}")
    return {"status": "success"}


@celery_app.task(name="deploy_application")
def deploy_application(deployment_id: int):
    """Deploy an application"""
    print(f"Deploying application for deployment {deployment_id}")
    return {"status": "success"}


@celery_app.task(name="collect_metrics")
def collect_metrics():
    """Collect metrics from servers"""
    print("Collecting metrics from all servers")
    return {"status": "success"}


@celery_app.task(name="process_logs")
def process_logs():
    """Process and aggregate logs"""
    print("Processing logs")
    return {"status": "success"}


# Schedule periodic tasks
celery_app.conf.beat_schedule = {
    'collect-metrics-every-minute': {
        'task': 'collect_metrics',
        'schedule': 60.0,  # Every 60 seconds
    },
    'process-logs-every-5-minutes': {
        'task': 'process_logs',
        'schedule': 300.0,  # Every 5 minutes
    },
}
