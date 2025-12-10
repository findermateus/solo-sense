<?php

namespace App\Application\UseCases;

use App\Application\DAO\HumidityDAOInterface;

readonly class ClearHistory
{
    public function __construct(private HumidityDAOInterface $humidityDAO)
    {
    }

    public function execute(): void
    {
        $this->humidityDAO->clearHumidityHistory();
    }
}