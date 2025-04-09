import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JournalEntries')

def lambda_handler(event, context):
    entryId = event['pathParameters']['id']

    table.delete_item(
        Key={'entryId': entryId}
    )

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Entry deleted'}),
        'headers': {'Access-Control-Allow-Origin': '*'}
    }