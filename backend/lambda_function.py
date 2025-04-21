import json
import uuid
import time
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("JournalEntries")

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])  # <-- fix: safely parse the incoming JSON string
        entry_id = str(uuid.uuid4())
        timestamp = int(time.time() * 1000)

        item = {
            "entryID": entry_id,
            "userEmail": "test@example.com",
            "title": body["title"],
            "content": body["content"],
            "timestamp": timestamp
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
            },
            "body": json.dumps({"message": "Entry saved", "entryId": entry_id})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
            },
            "body": json.dumps({"message": "Internal Server Error", "error": str(e)})
        }
