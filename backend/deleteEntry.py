import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("JournalEntries")

def lambda_handler(event, context):
    try:
        print("EVENT:", json.dumps(event))  # Debug log

        if "body" not in event or not event["body"]:
            raise ValueError("Missing or empty request body")

        body = json.loads(event["body"])
        entry_id = body.get("entryId")

        if not entry_id:
            raise ValueError("Missing entryId in request body")

        # Delete the item from DynamoDB
        table.delete_item(Key={"entryID": entry_id})

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
