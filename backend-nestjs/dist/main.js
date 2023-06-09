"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
function swaggerSetup(app) {
    console.log('\n\n\u001b[32m[Swagger]\u001b[0m \x1b[33m While the application is running, open your browser and navigate to\x1b[0m \u001b[34mhttp://localhost:3000/api\u001b[0m\x1b[33m. You should see the Swagger UI.\n\n\x1b[0m');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    swaggerSetup(app);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map