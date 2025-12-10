<?php

namespace App\Infra;

use Exception;
use Throwable;

class ApplicationException extends Exception
{
    private string $errorCode;

    private int $httpStatus;

    public function __construct(string $message, int $httpStatus, string $errorCode, Throwable|null $previous = null)
    {
        $this->httpStatus = $httpStatus;
        $this->errorCode = $errorCode;
        
        parent::__construct($message, 0, $previous);
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getHttpStatus(): int
    {
        return $this->httpStatus;
    }
}
