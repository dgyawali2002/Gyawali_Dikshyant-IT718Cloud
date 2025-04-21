import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JournalEntries')

def lambda_handler(event, context):
    try:
        response = table.scan()

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE'
            },
            'body': json.dumps({ "entries": response['Items'] })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                "message": "Internal Server Error",
                "error": str(e)
            })
        }