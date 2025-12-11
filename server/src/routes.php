<?php

use App\Controllers\HumidityController;
use App\Infra\ApiTokenMiddleware;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\Routing\RouteCollectorProxy;

/** @var \Slim\App $app */

$app->get('/', function (RequestInterface $request, ResponseInterface $response, $args) {
    $response->getBody()->write("Humidity API is running.");
    return $response;
});

$app->group('/humidity', function (RouteCollectorProxy $app) {
    $app->get('', HumidityController::class . ':getHumidityHistory');
    $app->post('/{humidityValue}', HumidityController::class . ':saveHumidity');
    $app->delete('', HumidityController::class . ':clearHumidityHistory');
})->add(new ApiTokenMiddleware());
