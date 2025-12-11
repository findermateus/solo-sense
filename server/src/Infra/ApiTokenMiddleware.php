<?php

namespace App\Infra;

use App\Application\Exceptions\NotAuthorizedException;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ApiTokenMiddleware
{
    public function __invoke(RequestInterface $request, RequestHandlerInterface $requestHandler): ResponseInterface
    {
        $requestApiToken = $request->getHeaderLine('ApiToken');
        $apiToken = getenv('API_TOKEN');

        if ($apiToken !== $requestApiToken) {
            throw new NotAuthorizedException('Invalid API token.');
        }

        return $requestHandler->handle($request);
    }
}