import {APIGatewayProxyHandler} from "aws-lambda";
import {document} from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {

  const { id: user_id } = event.pathParameters

  const { id: todo_id } = JSON.parse(event.body)

  const response = await document.scan({
    TableName: 'todos',
    FilterExpression: 'id = :id AND user_id = :user_id',
    ExpressionAttributeValues: {
      ':id': todo_id,
      ':user_id': user_id,
    }
  }).promise();

  if(response.Count === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Todo not found',
      }),
    }
  }

  const todo = response.Items[0];

  console.log(todo);
  console.log(!todo.done);
  console.log(!Boolean(todo.done));

  await document.put({
    TableName: 'todos',
    Item: {
      ...todo,
      done: !todo.done,
    }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({message: 'Todo updated'}),
  }

}
