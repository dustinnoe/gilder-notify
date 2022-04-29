import { Injectable } from '@nestjs/common';
import Database from 'better-sqlite3';

const db = new Database('test.db');

@Injectable()
export class AppService {
  notifyMe(body: any): any {
    console.log(body.method)

    return body;
  }
}
