<?php

namespace App\Application\UseCases;

use App\Application\DAO\HumidityDAOInterface;

final readonly class GetHumidityHistory
{
    public function __construct(
        private HumidityDAOInterface $humidityDAO
    )
    {}
    
    public function execute(): array
    {
        return $this->humidityDAO->getAllHumidity();
    }
}
