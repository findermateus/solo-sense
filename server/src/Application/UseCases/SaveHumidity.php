<?php

namespace App\Application\UseCases;

use App\Application\DAO\HumidityDAOInterface;
use App\Application\DTOs\HumidityDTO;

final readonly class SaveHumidity
{
    public function __construct(
        private HumidityDAOInterface $humidityDAO
    )
    {}

    public function execute(float $humidityValue): void
    {
        $humidityDTO = new HumidityDTO($humidityValue);
        $this->humidityDAO->saveHumidity($humidityDTO);
    }
}
