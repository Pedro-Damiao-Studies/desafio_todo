import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import {randomUUID} from "crypto";

interface ICreateTodoRequest {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, deadline } = JSON.parse(event.body) as ICreateTodoRequest;

  const { id } = event.pathParameters;

  const todoToCreate = {
    id: randomUUID(),
    user_id: id,
    title,
    done: false,
    deadline: new Date(deadline).toISOString(),
    created_at: new Date().toISOString(),
  }

  await document.put({
    TableName: 'todos',
    Item: {
      ...todoToCreate,
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      ...todoToCreate,
    }),
  }
}
