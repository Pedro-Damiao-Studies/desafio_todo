import {APIGatewayProxyHandler} from "aws-lambda";
import {document} from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {

  const { id: user_id } = event.pathParameters;

  const todos = await document.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': user_id,
    }
  }).promise();

  if(todos.Count === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'No todos found for this user',
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todos.Items),
  }

}
