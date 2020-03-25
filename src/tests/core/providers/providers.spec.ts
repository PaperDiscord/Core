describe('', () => {
  it('', () => expect(true).toBeTruthy());
});
// import { ProviderDecorator } from '../../../core/providers/provider.decorator';
// import { PaperModule } from '../../../core/module';
// import { PaperFactory } from '../../../core';
// import { OnInit } from '../../../common/interfaces/on-init';

// import 'reflect-metadata';
// import { PROPERTY_TYPE } from '../../../constants';
// import { Inject } from '../../../core/inject/inject';
// import { PaperApp } from '../../../core/paper-app';
// import { LoggerService } from '../../../common/services/logger.service';
// import { Commander } from '../../../core/commands/commander';
// import { Command } from '../../../core/commands';

// describe('Test', () => {
//   it('', () => {
//     const t: ClassDecorator = target => {};

//     const t2: PropertyDecorator = (target, propKey) => {};

//     @t
//     class Test {
//       @t2
//       test: Number;
//     }

//     expect(true).toBeTruthy();
//   });
// });

// describe('Providers', () => {
//   @ProviderDecorator()
//   class ProviderNotIntModule {
//     public readonly hello = 'world';
//   }

//   @Commander({ baseCommand: 'hello' })
//   class ProviderInModule implements OnInit {
//     @Inject()
//     public t: ProviderNotIntModule;

//     @App()
//     app: PaperApp;

//     @Command('hello')
//     te(@App() test) {
//       console.log(test);
//     }

//     paperOnInit() {}
//   }

//   @PaperModule({ providers: [ProviderInModule, ProviderNotIntModule] })
//   class ExampleModule {}

//   xit('asd', () => {
//     const t = new ProviderInModule();

//     console.log('asdads');
//     t.te('hi');
//   });

//   it('should ', async () => {
//     const app = await PaperFactory.create(ExampleModule);
//     expect(app).toBeTruthy();
//   });
// });
