import json, boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JournalEntries')

def lambda_handler(event, context):
    response = table.scan()
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items']),
        'headers': {'Access-Control-Allow-Origin': '*'}
    }
