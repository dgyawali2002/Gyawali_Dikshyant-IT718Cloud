import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("JournalEntries")

def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])
        entry_id = body["entryId"]

        # Set the correct partition key value
        user_email = "test@example.com"  # This should match how the item was saved

        table.delete_item(Key={
            "userEmail": user_email,
            "entryID": entry_id
        })

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
            },
            "body": json.dumps({"message": "Entry deleted", "entryId": entry_id})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Internal Server Error",
                "error": str(e)
            })
        }
