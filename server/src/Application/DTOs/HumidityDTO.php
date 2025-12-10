<?php

namespace App\Application\DTOs;

use JsonSerializable;

class HumidityDTO implements JsonSerializable
{
    private const HUMIDITY_STATUS = [

    ];

    private string $time;

    public function __construct(private float $value)
    {
        $this->time = (new \DateTime())->format('dd-mm-YYYY H:i:s');
    }

    private function getHumidityStatus(): string
    {
        return "normal";
    }

    public function jsonSerialize(): mixed
    {
        return [
            'status' => $this->getHumidityStatus(),
            'value' => $this->value,
            'time' => $this->time,
        ];
    }
}
