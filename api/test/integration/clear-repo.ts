import { TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

export async function clearRepo(testingModule: TestingModule) {
  const connection = testingModule.get<Connection>(getConnectionToken());
  await connection.query(
    `
          TRUNCATE ${connection.entityMetadatas
            .map((metadata) => `"${metadata.tableName}"`)
            .join(',')} CASCADE
        `,
  );
}
