<?php

namespace App\Application\Exceptions;

use App\Infra\ApplicationException;

class NotAuthorizedException extends ApplicationException
{
    public function __construct(string $message)
    {
        parent::__construct($message, 401, "NOT_AUTHORIZED");
    }
}