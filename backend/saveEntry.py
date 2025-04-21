import json, boto3, uuid, datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JournalEntries')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    item = {
        'entryId': str(uuid.uuid4()),
        'title': body['title'],
        'content': body['entry'],
        'timestamp': datetime.datetime.now().isoformat()
    }
    table.put_item(Item=item)
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Entry saved', 'entryId': item['entryId']}),
        'headers': {'Access-Control-Allow-Origin': '*'}
    }
