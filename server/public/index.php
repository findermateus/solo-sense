<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Infra\ApplicationException;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Factory\AppFactory;

$container = require __DIR__ . '/../src/dependencies.php';

AppFactory::setContainer($container);

$app = AppFactory::create();

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$customErrorHandler = function (
    ServerRequestInterface $request,
    Throwable $exception,
) use ($app) {
   
    $response = $app->getResponseFactory()->createResponse();
    
    if ($exception instanceof ApplicationException) {
        $errorCode = $exception->getErrorCode();
        $httpStatus = $exception->getHttpStatus();
        
        $response->getBody()->write(json_encode([
            'error' => [
                'code' => $errorCode,
                'message' => $exception->getMessage(),
            ],
        ]));
        
        return $response->withStatus($httpStatus)
            ->withHeader('Content-Type', 'application/json');
    }
   
    $response->getBody()->write(json_encode([
        'error' => [
            'code' => 'INTERNAL_SERVER_ERROR',
            'message' => $exception->getMessage(),
        ],
    ]));

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(500);
};

$errorMiddleware->setDefaultErrorHandler($customErrorHandler); 

require __DIR__ . '/../src/routes.php';

$app->run();
