import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JournalEntries')

def lambda_handler(event, context):
    response = table.scan()
    entries = response.get('Items', [])

    return {
        'statusCode': 200,
        'body': json.dumps(entries),
        'headers': {'Access-Control-Allow-Origin': '*'}
    }