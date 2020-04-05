# PaperDiscord Core

PaperDiscord is heavily inspired to NestJS. PaperDiscord to DiscordJS is exactly what NestJS is to ExpressJS

**This is under heavy development, as such, many things are going to break, changed or removed.**

## An Extremely Basic Example

```ts
import {
  PaperDiscordFactory,
  Module,
  Controller,
  Command,
  Author,
} from '@paperdiscord/core';

import * as dotenv from 'dotenv';
dotenv.config();

@Controller('say')
class EchoController {
  @Command('hello')
  public async echo(@Author() user) {
    return `Hello there ${user.username}`;
  }
}

@Module({
  controllers: [EchoController],
})
class MyModule {}

const main = async () => {
  const app = await PaperDiscordFactory.create(MyModule);

  await app.getClient().login(process.env.TOKEN);
};

main();
```